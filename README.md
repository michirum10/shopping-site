# ショッピングサイト（Flask + SQLite + JavaScript）

JavaScript のみで作られたショッピングサイトを、Flask（Python）+ SQLite によるバックエンドAPI構成に拡張したポートフォリオ作品です。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | HTML / CSS / JavaScript（ES Modules） |
| バックエンド | Python / Flask / Flask-CORS |
| データベース | SQLite |
| フロント公開 | Vercel |
| バックエンド公開 | Render（または Railway） |

## システム構成図

```
ブラウザ（Vercel）
    ↕ fetch（REST API）
Flask サーバー（Render）
    ↕ SQL
SQLite DB
```

## APIエンドポイント

| メソッド | URL | 説明 |
|---|---|---|
| GET | `/api/products` | 商品一覧取得 |
| GET | `/api/products/<id>` | 商品詳細取得 |
| POST | `/api/orders` | 注文登録 |
| GET | `/api/orders` | 注文履歴取得 |

---

## ローカル開発環境のセットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/michirum10/shopping-site.git
cd shopping-site/backend
```

### 2. 仮想環境を作成・有効化

```bash
python -m venv venv

# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. パッケージをインストール

```bash
pip install -r requirements.txt
```

### 4. DBを初期化

```bash
python init_db.py
```

### 5. Flask サーバーを起動

```bash
python app.py
```

サーバーが `http://127.0.0.1:5000` で起動します。

### 6. フロントエンドを起動

`JavaScript/ShoppingSite/html/index.html` をブラウザで開く（Live Server推奨）。

---

## Render へのデプロイ手順

1. [Render](https://render.com) でアカウント作成
2. 「New Web Service」→ GitHubリポジトリを選択
3. 以下を設定：

| 項目 | 値 |
|---|---|
| Root Directory | `Python/ShoppingSite` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn app:app` |

4. デプロイ完了後、表示されたURLを `index.js` の `API_BASE_URL` に設定：

```javascript
const API_BASE_URL = 'https://your-app.onrender.com'
```

## Vercel へのデプロイ手順

フロントエンド（`JavaScript/ShoppingSite`）を Vercel にデプロイします。

1. Vercel でプロジェクトを開く
2. Environment Variables に以下を追加：
   - `VITE_API_BASE_URL` = `https://your-app.onrender.com`
3. デプロイ

---

## ディレクトリ構成

```
Python/ShoppingSite/
├── app.py            # Flask メインアプリ
├── init_db.py        # DB初期化スクリプト
├── requirements.txt  # Pythonパッケージ一覧
├── shop.db           # SQLiteデータベース（自動生成）
└── README.md

JavaScript/ShoppingSite/
├── html/
│   ├── index.html
│   ├── detail.html
│   ├── confirm.html
│   └── complete.html
├── css/
├── js/
│   ├── Cart.js           # カートクラス（変更なし）
│   ├── index.js          # ★ API対応に変更
│   ├── detail.js         # 変更なし
│   ├── confirm.js        # ★ API対応に変更（注文をDBへ保存）
│   └── complete.js       # 変更なし
└── img/
```
