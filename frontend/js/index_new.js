import Cart from "../js/Cart.js"

const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:5000'

let cart
let productList = []

// カート復元
if (window.sessionStorage.getItem('cartItems')) {
    cart = new Cart(JSON.parse(window.sessionStorage.getItem('cartItems')))
} else {
    cart = new Cart()
}

// 商品一覧取得・描画
window.onload = async function () {
    try {
        const res = await fetch(`${API_BASE_URL}/api/products`)
        if (!res.ok) throw new Error('取得失敗')
        productList = await res.json()

        // 件数表示
        const countEl = document.getElementById('productCount')
        if (countEl) countEl.textContent = `${productList.length} アイテム`

        renderProductList(productList)
    } catch (err) {
        console.error(err)
        document.getElementById('itemList').innerHTML =
            '<p style="color:#c0533a;text-align:center;padding:60px;grid-column:1/-1;">商品の読み込みに失敗しました。<br>Flaskサーバーを起動してください。</p>'
    }
}

// 商品カード描画
function renderProductList(items) {
    const output = document.getElementById('itemList')
    output.innerHTML = ''

    // 絵文字マッピング（imgがない場合のフォールバック）
    const emojiMap = {
        'apple': '🍎', 'banana': '🍌', 'mikan': '🍊',
        'ichigo': '🍓', 'budou': '🍇'
    }

    items.forEach(function (item, index) {
        const card = document.createElement('div')
        card.className = 'item-card'
        card.style.animationDelay = `${index * 0.07}s`
        card.addEventListener('click', () => screenTransitionDetail(index))

        // imgファイル名から絵文字を取得（フォールバック用）
        const imgKey = Object.keys(emojiMap).find(k => item.img && item.img.includes(k))
        const emoji = emojiMap[imgKey] || '🛒'

        card.innerHTML = `
<div class="card-img-wrap">
    <img src="../img/${item.img}" alt="${item.name}"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="card-img-placeholder" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">${emoji}</div>
</div>
<div class="card-body">
    <div class="card-tag">新鮮入荷</div>
    <h2>${item.name}</h2>
    <p class="price">¥${item.price.toLocaleString()}</p>
</div>
<div class="card-overlay">
    <span class="view-label">詳細を見る</span>
</div>
`
        output.appendChild(card)
    })
}

// 詳細ポップアップ
function screenTransitionDetail(index) {
    const option = 'width=420,height=660'
    const newwin = open('./detail.html', 'detail', option)
    const item = productList[index]
    newwin.onload = () => newwin.postMessage({ item, index }, window.location.origin)
}

// カートに追加（数量対応）
function cartIn(itemIndex, quantity = 1) {
    cart.addItem(productList[itemIndex], quantity)
    window.sessionStorage.setItem('cartItems', JSON.stringify(cart.itemList))

    // ヘッダーのカート件数更新
    const total = cart.itemList.reduce((sum, i) => sum + (i.quantity || 1), 0)
    const countEl = document.getElementById('cartCount')
    if (countEl) countEl.textContent = total

    showToast(`「${productList[itemIndex].name}」をカートに追加しました`)
}

// トースト通知
function showToast(message) {
    const toast = document.getElementById('toast')
    if (!toast) return
    toast.textContent = message
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 2800)
}

window.cartIn = cartIn
