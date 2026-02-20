const API_BASE_URL = window.API_BASE_URL || 'http://127.0.0.1:5000'

window.onload = async function () {
    const output = document.getElementById('orderList')

    try {
        const res = await fetch(`${API_BASE_URL}/api/orders`)
        if (!res.ok) throw new Error('注文履歴の取得に失敗しました')

        const orders = await res.json()

        if (orders.length === 0) {
            output.innerHTML = '<p class="empty">注文履歴はありません。</p>'
            return
        }

        orders.forEach(order => {
            const card = document.createElement('div')
            card.className = 'order-card'

            const itemsHTML = order.items.map(item => `
        <li>${item.name}：¥${item.price} × ${item.quantity}個</li>
            `).join('')

            card.innerHTML = `
        <div class="order-header">
            <span class="order-id">注文 #${order.id}</span>
            <span class="order-date">${order.ordered_at}</span>
        </div>
        <ul class="order-items">${itemsHTML}</ul>
        <div class="order-total">合計：<strong>¥${order.total_price}</strong></div>
`
            output.appendChild(card)
        })

    } catch (err) {
        console.error(err)
        output.innerHTML = '<p style="color:red;">注文履歴の読み込みに失敗しました。</p>'
    }
}
