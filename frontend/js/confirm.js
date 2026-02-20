import Cart from "../js/Cart.js"

const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:5000'

let cart = new Cart(JSON.parse(sessionStorage.getItem('cartItems') || '[]'))

function renderCart() {
    const output = document.getElementById('itemList')
    const summary = document.getElementById('summary')
    const completeBtn = document.getElementById('complete')
    output.innerHTML = ''

    if (cart.itemList.length === 0) {
        output.innerHTML = `
<div class="empty-cart">
    <span class="empty-icon">🛒</span>
    カートの中は空です。<br>
    気になる商品をカートに追加してください。
</div>`
        if (summary) summary.style.display = 'none'
        if (completeBtn) completeBtn.style.display = 'none'
        return
    }

    cart.itemList.forEach(item => {
        const div = document.createElement('div')
        div.className = 'cart-item'
        div.innerHTML = `
<div class="cart-item-info">
    <h3>${item.name}</h3>
    <p class="item-meta">¥${item.price.toLocaleString()} × ${item.quantity}個</p>
</div>
<div class="cart-item-right">
    <span class="item-subtotal">¥${(item.price * item.quantity).toLocaleString()}</span>
    <button class="delete-btn" data-id="${item.id}" title="削除">✕</button>
</div>
`
        output.appendChild(div)
    })

    // 合計サマリー更新
    if (summary) {
        summary.style.display = 'block'
        const totalQty = cart.itemList.reduce((s, i) => s + i.quantity, 0)
        document.getElementById('itemCount').textContent = `${totalQty}点`
        document.getElementById('totalPrice').textContent = `¥${cart.totalPrice.toLocaleString()}`
    }

    // 削除ボタン
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            cart.removeItem(Number(this.dataset.id))
            sessionStorage.setItem('cartItems', JSON.stringify(cart.itemList))
            renderCart()
        })
    })
}

renderCart()

// 注文確定
const completeBtn = document.getElementById('complete')
if (completeBtn) {
    completeBtn.addEventListener('click', async () => {
        if (cart.itemList.length === 0) return

        completeBtn.disabled = true
        completeBtn.textContent = '送信中...'

        try {
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart.itemList })
            })
            if (!res.ok) throw new Error()

            sessionStorage.removeItem('cartItems')
            location.href = './complete.html'
        } catch {
            alert('注文に失敗しました。もう一度お試しください。')
            completeBtn.disabled = false
            completeBtn.textContent = 'ご注文を確定する'
        }
    })
}
