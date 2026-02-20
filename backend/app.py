from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # フロントエンド(Vercel)からのリクエストを許可

DATABASE = 'shop.db'

# -----------------------------------------------
# DB接続ヘルパー
# -----------------------------------------------
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # 辞書形式で取得できるようにする
    return conn


# -----------------------------------------------
# DB初期化（テーブル作成 + サンプルデータ投入）
# -----------------------------------------------
def init_db():
    conn = get_db()
    cur = conn.cursor()

    # 商品テーブル
    cur.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            name    TEXT    NOT NULL,
            price   INTEGER NOT NULL,
            img     TEXT    NOT NULL,
            detail  TEXT    NOT NULL
        )
    ''')

    # 注文テーブル
    cur.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            ordered_at   TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
            total_price  INTEGER NOT NULL
        )
    ''')

    # 注文明細テーブル
    cur.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id   INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            name       TEXT    NOT NULL,
            price      INTEGER NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )
    ''')

    # サンプル商品データ（初回のみ）
    cur.execute('SELECT COUNT(*) FROM products')
    if cur.fetchone()[0] == 0:
        sample_products = [
            ('りんご',   150, 'apple.jpg',  '新鮮なりんごです。甘くてジューシーです。'),
            ('バナナ',   100, 'banana.jpg', '栄養満点のバナナです。'),
            ('みかん',   200, 'mikan.jpg',  '甘くて酸っぱいみかんです。'),
            ('いちご',   500, 'ichigo.jpg', '真っ赤なジューシーないちごです。'),
            ('ぶどう',   400, 'budou.jpg',  '大粒で甘いぶどうです。'),
        ]
        cur.executemany(
            'INSERT INTO products (name, price, img, detail) VALUES (?, ?, ?, ?)',
            sample_products
        )

    conn.commit()
    conn.close()


# -----------------------------------------------
# 商品API
# -----------------------------------------------

# 商品一覧取得
@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_db()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    return jsonify([dict(p) for p in products])


# 商品詳細取得
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = get_db()
    product = conn.execute(
        'SELECT * FROM products WHERE id = ?', (product_id,)
    ).fetchone()
    conn.close()

    if product is None:
        return jsonify({'error': '商品が見つかりません'}), 404

    return jsonify(dict(product))


# -----------------------------------------------
# 注文API
# -----------------------------------------------

# 注文登録
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()

    # バリデーション
    if not data or 'items' not in data or len(data['items']) == 0:
        return jsonify({'error': 'カートが空です'}), 400

    items = data['items']
    total_price = sum(item['price'] for item in items)

    conn = get_db()
    cur = conn.cursor()

    # 注文レコード作成
    cur.execute(
        'INSERT INTO orders (total_price) VALUES (?)',
        (total_price,)
    )
    order_id = cur.lastrowid

    # 注文明細レコード作成
    for item in items:
        cur.execute(
            'INSERT INTO order_items (order_id, product_id, name, price) VALUES (?, ?, ?, ?)',
            (order_id, item.get('id', 0), item['name'], item['price'])
        )

    conn.commit()
    conn.close()

    return jsonify({
        'message': '注文が完了しました',
        'order_id': order_id,
        'total_price': total_price
    }), 201


# 注文履歴取得
@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn = get_db()
    orders = conn.execute(
        'SELECT * FROM orders ORDER BY ordered_at DESC'
    ).fetchall()

    result = []
    for order in orders:
        items = conn.execute(
            'SELECT * FROM order_items WHERE order_id = ?', (order['id'],)
        ).fetchall()
        result.append({
            **dict(order),
            'items': [dict(i) for i in items]
        })

    conn.close()
    return jsonify(result)


# -----------------------------------------------
# 起動
# -----------------------------------------------
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
