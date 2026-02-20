const emojiMap = {
    'dark': '🍫', 'milk': '🍬', 'white': '🤍', 'ruby': '💎',
    'nama': '✨', 'almond': '🌰', 'macadamia': '🌰',
    'ichigo': '🍓', 'berry': '🍓', 'cookie': '🍪',
    'sachertorte': '🎂', 'cake': '🎂', 'gift': '🎁', 'valentine': '🎁'
}

let currentQty = 1
let currentIndex = null

window.addEventListener('message', (event) => {
    const item = event.data.item

    if (!item) {
        window.close()
        return
    }

    currentIndex = event.data.index
    currentQty = 1  // ポップアップを開くたびにリセット

    const imgKey = Object.keys(emojiMap).find(k => item.img && item.img.toLowerCase().includes(k))
    const emoji = emojiMap[imgKey] || '🍫'

    const output = document.getElementById('product-detail')
    output.innerHTML = `
<div class="detail-img-wrap">
    <img src="../img/${item.img}" alt="${item.name}"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="detail-img-placeholder"
         style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:5rem;">${emoji}</div>
</div>

<div class="detail-body">
    <div class="detail-category">Artisan Chocolate</div>
    <h2 class="detail-name">${item.name}</h2>
    <p class="detail-price">¥${item.price.toLocaleString()}</p>
    <p class="detail-description">${item.detail}</p>
</div>

<div class="quantity-section">
    <p class="quantity-label">数量</p>
    <div class="quantity-control">
        <button class="qty-btn" id="qty-minus">－</button>
        <span id="qty-display">1</span>
        <button class="qty-btn" id="qty-plus">＋</button>
    </div>
</div>

<div class="cart-section">
    <button class="add-to-cart" id="add-to-cart-btn">カートに追加する</button>
</div>
`

    // ← onclick ではなく addEventListener で登録（moduleスコープ対応）
    document.getElementById('qty-minus').addEventListener('click', () => changeQty(-1))
    document.getElementById('qty-plus').addEventListener('click',  () => changeQty(1))
    document.getElementById('add-to-cart-btn').addEventListener('click', () => cartIn())
})

function changeQty(delta) {
    currentQty = Math.max(1, currentQty + delta)
    document.getElementById('qty-display').textContent = currentQty
}

function cartIn() {
    if (currentIndex === null) return

    if (window.opener && typeof window.opener.cartIn === 'function') {
        window.opener.cartIn(currentIndex, currentQty)
        window.close()
    } else {
        alert('カートへの追加に失敗しました。一覧ページを再度開いてください。')
    }
}
