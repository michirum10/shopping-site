import Cart from "../js/Cart.js"

const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:5000'

const output = document.getElementById('itemList')

if (window.sessionStorage.getItem('cartItems')) {
  const cart = new Cart(JSON.parse(window.sessionStorage.getItem('cartItems')))

  // カート内商品を画面に表示
  cart.itemList.forEach(function (item) {
    output.innerHTML += `
  <div class="item-card">
    <h2>${item.name}</h2>
    <p>¥${item.price}</p>
  </div>
`
  })

  // 合計金額を表示
  const total = cart.itemList.reduce((sum, item) => sum + item.price, 0)
  output.innerHTML += `<div class="total"><strong>合計：¥${total}</strong></div>`

  // 購入ボタンにAPIを使った注文処理をバインド
  const completeBtn = document.getElementById('complete')
  if (completeBtn) {
    completeBtn.addEventListener('click', async function () {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart.itemList })
        })

        if (!res.ok) throw new Error('注文の送信に失敗しました')

        const result = await res.json()
        console.log('注文完了:', result)

        // 注文成功 → sessionStorageを削除して完了画面へ
        window.sessionStorage.removeItem('cartItems')
        location.href = './complete.html'

      } catch (err) {
        console.error(err)
        alert('注文に失敗しました。もう一度お試しください。')
      }
    })
  }

} else {
  // カートが空の場合
  output.innerHTML += `
  <div class="item-card">
    <p>カートの中は空っぽです。</p>
  </div>
`
  document.getElementById('complete')?.remove()
}
