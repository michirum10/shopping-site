"""
DBの初期化スクリプト
初回またはDBをリセットしたい時に実行する。

使い方:
  python init_db.py
"""
import sqlite3

DATABASE = 'shop.db'

conn = sqlite3.connect(DATABASE)
cur = conn.cursor()

# テーブル作成
cur.executescript('''
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;

    CREATE TABLE products (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        name    TEXT    NOT NULL,
        price   INTEGER NOT NULL,
        img     TEXT    NOT NULL,
        detail  TEXT    NOT NULL
    );

    CREATE TABLE orders (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        ordered_at   TEXT    NOT NULL DEFAULT (datetime("now", "localtime")),
        total_price  INTEGER NOT NULL
    );

    CREATE TABLE order_items (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id   INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        name       TEXT    NOT NULL,
        price      INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
    );
''')

# サンプル商品データ
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
print('✅ DBの初期化が完了しました！')
