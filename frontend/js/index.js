import Cart from "../js/Cart.js"

// -----------------------------------------------
// Flask APIのベースURL
// ローカル開発時: http://127.0.0.1:5000
// 本番(Render等): 環境変数またはここを書き換える
// -----------------------------------------------
const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:5000'

// カート（モジュールスコープ）
let cart
let productList = []  // APIから取得した商品リストを保持

// セッションストレージからカートを復元
if (window.sessionStorage.getItem('cartItems')) {
  cart = new Cart(JSON.parse(window.sessionStorage.getItem('cartItems')))
} else {
  cart = new Cart()
}

// -----------------------------------------------
// 起動：商品一覧をAPIから取得して表示
// -----------------------------------------------
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

// -----------------------------------------------
// 商品一覧をHTMLに描画
// -----------------------------------------------
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

// -----------------------------------------------
// 商品詳細ポップアップを開く
// -----------------------------------------------
function screenTransitionDetail(index) {
  const option = 'width=400,height=600'
  const newwin = open('./detail.html', 'detail', option)
  const item = productList[index]

  newwin.onload = () => newwin.postMessage({ item, index }, window.location.origin)
}

// -----------------------------------------------
// カートに追加（詳細ウィンドウから呼ばれる）
// -----------------------------------------------
function cartIn(itemIndex) {
  cart.addItem(productList[itemIndex])
  const data = JSON.stringify(cart.itemList)
  window.sessionStorage.setItem('cartItems', data)
  console.log('カートに追加:', productList[itemIndex].name)
}

// グローバルスコープに公開（詳細ウィンドウから呼び出せるように）
window.cartIn = cartIn
