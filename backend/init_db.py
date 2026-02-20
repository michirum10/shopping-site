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
        ordered_at   TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        total_price  INTEGER NOT NULL
    );

    CREATE TABLE order_items (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id   INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        name       TEXT    NOT NULL,
        price      INTEGER NOT NULL,
        quantity   INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (order_id) REFERENCES orders(id)
    );
''')

sample_products = [
    ('ダークチョコレート',      1200, 'sweets_chocolate_dark.png',          'カカオ70%以上の深みある味わい。ほろ苦さの中に芳醇な香りが広がる、大人のための本格ダークチョコレートです。'),
    ('ミルクチョコレート',      1200, 'sweets_chocolate_milk.png',          'まろやかなミルクとカカオが絶妙に溶け合う定番の味。なめらかな口溶けで、どなたにも愛されるやさしい甘さです。'),
    ('ホワイトチョコレート',    1200, 'sweets_chocolate_white.png',         'バニラの香りが華やかに広がる、クリーミーなホワイトチョコレート。贈り物にも人気の上品な一品です。'),
    ('ルビーチョコレート',      1500, 'sweets_ruby_chocolate.png',          '第4のチョコレートと呼ばれる希少なルビーカカオを使用。天然のピンク色と甘酸っぱいベリーのような風味が特徴です。'),
    ('生チョコレート',          1500, 'sweets_nama_chocolate.png',          '口に入れた瞬間とろけるなめらかな食感。厳選した生クリームとカカオが織りなす、濃厚でリッチな味わいです。'),
    ('いちごホワイトチョコ',    500, 'chocolate_ichigo_white.png',         'ホワイトチョコレートに甘酸っぱいいちごを組み合わせました。見た目も華やかで贈り物に人気の一品です。'),
    ('いちごチョコレート',      500, 'chocolate_ichigo_brown.png',         'ミルクチョコレートといちごの相性抜群な組み合わせ。フリーズドライいちごの酸味がアクセントになっています。'),
    ('アーモンドチョコレート',  800, 'chocolate_almond.png',               '香ばしくローストしたアーモンドをチョコレートでコーティング。サクサクとした食感と甘さのバランスが絶妙です。'),
    ('マカダミアナッツチョコ',  800, 'chocolate_macadamianut.png',         'クリーミーなマカダミアナッツをまるごとチョコレートで包みました。濃厚なコクとナッツの風味が口いっぱいに広がります。'),
    ('クッキーアソート',        2500, 'sweets_cookie.png',                  'サクサク食感のバタークッキーにチョコレートをたっぷり使用。コーヒーや紅茶との相性も抜群な定番スイーツです。'),
    ('ザッハトルテ',            600, 'sweets_chocolate_cake_sachertorte.png','ウィーン発祥の伝統的なチョコレートケーキ。濃厚なチョコスポンジとアプリコットジャムの組み合わせが絶品です。'),
    ('ボンボンアソート',       3800, 'valentine_chocolates.png',           '人気商品を詰め合わせた特別ギフトセット。大切な方への贈り物に最適な、上質な箱入りアソートです。12粒入り。'),
]

cur.executemany(
    'INSERT INTO products (name, price, img, detail) VALUES (?, ?, ?, ?)',
    sample_products
)

conn.commit()
conn.close()
print('✅ チョコレート商品データの初期化が完了しました！')
print(f'   → {len(sample_products)}件の商品を登録しました。')
for i, p in enumerate(sample_products, 1):
    print(f'   [{i:02}] {p[0]} — ¥{p[1]}')
