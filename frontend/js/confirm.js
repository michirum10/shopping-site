import Cart from "../js/Cart.js"

const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:5000'

let cart

if (window.sessionStorage.getItem('cartItems')) {
    cart = new Cart(JSON.parse(window.sessionStorage.getItem('cartItems')))
} else {
    cart = new Cart()
}

// カート画面を描画
function renderCart() {
    const output = document.getElementById('itemList')
    output.innerHTML = ''

    if (cart.itemList.length === 0) {
        output.innerHTML = `
    <div class="item-card">
        <p>カートの中は空っぽです。</p>
    </div>`
        document.getElementById('complete')?.remove()
        return
    }

    cart.itemList.forEach(function (item) {
        const card = document.createElement('div')
        card.className = 'item-card'
        card.innerHTML = `
    <div class="cart-item">
        <div class="cart-item-info">
            <h2>${item.name}</h2>
            <p>¥${item.price} × ${item.quantity}個 ＝ <strong>¥${item.price * item.quantity}</strong></p>
        </div>
        <button class="delete-btn" data-id="${item.id}">削除</button>
    </div>
`
        output.appendChild(card)
    })

    // 合計金額
    output.innerHTML += `
    <div class="total-price">
        <strong>合計金額：¥${cart.totalPrice}</strong>
    </div>`

    // 削除ボタンにイベントをバインド
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            cart.removeItem(Number(this.dataset.id))
            // セッションに反映
            window.sessionStorage.setItem('cartItems', JSON.stringify(cart.itemList))
            renderCart()
        })
    })
}

// 初回描画
renderCart()

// 購入ボタン
const completeBtn = document.getElementById('complete')
if (completeBtn) {
    completeBtn.addEventListener('click', async function () {
        if (cart.itemList.length === 0) {
            alert('カートが空です')
            return
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart.itemList })
            })

            if (!res.ok) throw new Error('注文の送信に失敗しました')

            const result = await res.json()
            console.log('注文完了:', result)

            window.sessionStorage.removeItem('cartItems')
            location.href = './complete.html'

        } catch (err) {
            console.error(err)
            alert('注文に失敗しました。もう一度お試しください。')
        }
    })
}
