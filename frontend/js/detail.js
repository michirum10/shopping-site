// このウィンドウの商品番号

// メッセージを受け取った時
window.addEventListener('message', (event) => {
  console.log(event.data)
  // 商品情報取得
  let item = event.data.item

  // itemが存在しない場合
  if (item == undefined) {
    // スクリプトでオープンしたものしかクローズできない
    window.close()
    // 直接URLにジャンプしてきた時は一覧に遷移
    location.href = './'
  }

  let output = document.getElementById('product-detail')
  let outhtml =
    `
<img class="product-image" src="../img/${item.img}" alt="商品名">
<h2 class="product-name">${item.name}</h2>
<p class="product-price">¥${item.price}</p>
<p id="detail">${item.detail}</p>
<button class="add-to-cart" onclick="cartIn(${event.data.index})">カートに追加</button>
`
  output.innerHTML += outhtml
})

// カートに入れる処理
function cartIn(index) {
  console.log(window.opener)
  // 親ウィンドウのcartIn関数を実行する。
  window.opener.cartIn(index)
  // ウィンドウを閉じる
  window.close()
}