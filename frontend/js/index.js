import Cart from "./Cart.js"   // ← ./Cart.js（同じjsフォルダ内）

const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:5000'

let cart
let productList = []

// カート復元
cart = new Cart(JSON.parse(sessionStorage.getItem('cartItems') || '[]'))

// 商品一覧取得
window.onload = async function () {
    try {
        const res = await fetch(`${API_BASE_URL}/api/products`)
        if (!res.ok) throw new Error('取得失敗')
        productList = await res.json()

        const countEl = document.getElementById('productCount')
        if (countEl) countEl.textContent = `${productList.length} アイテム`

        renderProductList(productList)
    } catch (err) {
        console.error(err)
        document.getElementById('itemList').innerHTML = `
            <p class="text-center py-5" style="color:#c0533a;">
                商品の読み込みに失敗しました。<br>Flaskサーバーを起動してください。
            </p>`
    }
}

// 絵文字フォールバックマップ
const emojiMap = {
    'dark': '🍫', 'milk': '🍬', 'white': '🤍', 'ruby': '💎',
    'nama': '✨', 'truffle': '🍩', 'caramel': '🧁', 'nut': '🌰',
    'almond': '🌰', 'macadamia': '🌰', 'berry': '🍓', 'ichigo': '🍓',
    'cookie': '🍪', 'muffin': '🧁', 'gift': '🎁', 'valentine': '🎁',
    'sachertorte': '🎂', 'cake': '🎂'
}

function getEmoji(imgFilename) {
    const key = Object.keys(emojiMap).find(k => imgFilename && imgFilename.toLowerCase().includes(k))
    return emojiMap[key] || '🍫'
}

// 商品カード描画（Bootstrap グリッド使用）
function renderProductList(items) {
    const output = document.getElementById('itemList')

    // Bootstrap グリッドのラッパー
    const row = document.createElement('div')
    row.className = 'row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3'

    items.forEach((item, index) => {
        const col = document.createElement('div')
        col.className = 'col'

        const emoji = getEmoji(item.img)

        col.innerHTML = `
<div class="product-card card border-0" style="animation-delay:${index * 0.06}s">
    <div class="product-img-wrap">
        <img src="../img/${item.img}" alt="${item.name}"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="fallback-emoji">${emoji}</div>
    </div>
    <div class="card-body-custom">
        <div class="card-category">Artisan Chocolate</div>
        <div class="card-name">${item.name}</div>
        <div class="card-bottom">
            <span class="card-price">¥${item.price.toLocaleString()}</span>
            <span class="card-arrow">詳細 →</span>
        </div>
    </div>
</div>`

        col.querySelector('.product-card').addEventListener('click', () => screenTransitionDetail(index))
        row.appendChild(col)
    })

    output.innerHTML = ''
    output.appendChild(row)
}

// 詳細ポップアップ
function screenTransitionDetail(index) {
    const newwin = open('./detail.html', 'detail', 'width=420,height=680')
    const item = productList[index]
    newwin.onload = () => newwin.postMessage({ item, index }, window.location.origin)
}

// カートに追加（detail.jsから呼ばれる）
function cartIn(itemIndex, quantity = 1) {
    cart.addItem(productList[itemIndex], quantity)
    sessionStorage.setItem('cartItems', JSON.stringify(cart.itemList))

    const total = cart.itemList.reduce((s, i) => s + (i.quantity || 1), 0)
    const el = document.getElementById('cartCount')
    if (el) el.textContent = total

    showToast(`「${productList[itemIndex].name}」をカートに追加しました`)
}

function showToast(message) {
    const toast = document.getElementById('toast')
    if (!toast) return
    toast.textContent = message
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 2800)
}

window.cartIn = cartIn
