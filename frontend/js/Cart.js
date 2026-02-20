export default class Cart {
    #itemList = []

    constructor(itemList = []) {
        this.#itemList = itemList
    }

    // 商品一覧取得
    get itemList() {
        return this.#itemList
    }

    // 商品追加（数量指定対応）
    addItem(item, quantity = 1) {
        // すでにカートにある商品は数量を加算
        const existing = this.#itemList.find(i => i.id === item.id)
        if (existing) {
            existing.quantity += quantity
        } else {
            this.#itemList.push({ ...item, quantity })
        }
    }

    // 商品削除
    removeItem(itemId) {
        this.#itemList = this.#itemList.filter(i => i.id !== itemId)
    }

    // 合計金額
    get totalPrice() {
        return this.#itemList.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    // 購入（カートをリセット）
    purchase() {
        this.#itemList = []
    }
}
