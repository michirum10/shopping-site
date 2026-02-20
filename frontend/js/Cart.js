export default class Cart{
    // 商品リスト
    #itemList = []

    constructor(itemList=[]){
        this.#itemList = itemList
    }
    
    // メソッド:商品一覧取得
    get itemList(){
        return this.#itemList
    }

    // メソッド:商品追加
    addItem(item){
        this.#itemList.push(item)
    }
    
    // メソッド:商品購入
    purchase(){
        this.#itemList = []
    }

}

