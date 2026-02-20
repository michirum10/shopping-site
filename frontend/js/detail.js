// メッセージを受け取った時（親ウィンドウから商品情報を受信）
window.addEventListener('message', (event) => {
    const item = event.data.item

    // itemが存在しない場合は一覧に戻る
    if (item == undefined) {
        window.close()
        location.href = './'
    }

    const output = document.getElementById('product-detail')
    output.innerHTML = `
<img class="product-image" src="../img/${item.img}" alt="${item.name}">
<h2 class="product-name">${item.name}</h2>
<p class="product-price">¥${item.price}</p>
<p id="detail">${item.detail}</p>

<div class="quantity-selector">
    <label for="quantity">数量：</label>
    <button type="button" onclick="changeQty(-1)">－</button>
    <span id="qty-display">1</span>
    <button type="button" onclick="changeQty(1)">＋</button>
</div>

<button class="add-to-cart" onclick="cartIn(${event.data.index})">カートに追加</button>
`
})

// 数量の増減
let currentQty = 1
function changeQty(delta) {
    currentQty = Math.max(1, currentQty + delta)
    document.getElementById('qty-display').textContent = currentQty
}

// カートに入れる処理（数量付き）
function cartIn(index) {
    window.opener.cartIn(index, currentQty)
    window.close()
}
