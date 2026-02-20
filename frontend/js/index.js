import Cart from "../js/Cart.js"

const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:5000'

let cart
let productList = []

// セッションストレージからカートを復元
if (window.sessionStorage.getItem('cartItems')) {
    cart = new Cart(JSON.parse(window.sessionStorage.getItem('cartItems')))
} else {
    cart = new Cart()
}

// 商品一覧をAPIから取得して表示
window.onload = async function () {
    try {
        const res = await fetch(`${API_BASE_URL}/api/products`)
        if (!res.ok) throw new Error('商品データの取得に失敗しました')
        productList = await res.json()
        renderProductList(productList)
    } catch (err) {
        console.error(err)
        document.getElementById('itemList').innerHTML =
            '<p style="color:red;">商品の読み込みに失敗しました。サーバーを確認してください。</p>'
    }
}

// 商品一覧描画
function renderProductList(items) {
    const output = document.getElementById('itemList')
    items.forEach(function (item, index) {
        const card = document.createElement('div')
        card.addEventListener('click', () => screenTransitionDetail(index))
        card.innerHTML = `
  <div class="item-card">
    <h2>${item.name}</h2>
    <img src="../img/${item.img}" alt="${item.name}">
    <p>¥${item.price}</p>
  </div>
`
        output.appendChild(card)
    })
}

// 詳細ポップアップを開く
function screenTransitionDetail(index) {
    const option = 'width=400,height=650'
    const newwin = open('./detail.html', 'detail', option)
    const item = productList[index]
    newwin.onload = () => newwin.postMessage({ item, index }, window.location.origin)
}

// カートに追加（数量対応）
function cartIn(itemIndex, quantity = 1) {
    cart.addItem(productList[itemIndex], quantity)
    const data = JSON.stringify(cart.itemList)
    window.sessionStorage.setItem('cartItems', data)

    // カート追加のフィードバック表示
    showToast(`「${productList[itemIndex].name}」をカートに追加しました`)
}

// トースト通知
function showToast(message) {
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: #333; color: #fff; padding: 12px 24px; border-radius: 8px;
        font-size: 14px; z-index: 9999; opacity: 0; transition: opacity 0.3s;
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.style.opacity = '1', 10)
    setTimeout(() => {
        toast.style.opacity = '0'
        setTimeout(() => toast.remove(), 300)
    }, 2500)
}

window.cartIn = cartIn
