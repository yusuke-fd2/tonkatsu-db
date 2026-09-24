# Tonkatsu DB

とんかつ店とメニューを店舗ごとに管理する Web アプリケーションです。通常のフォームに加え、自然文を AI で解析してメニュー情報を登録できます。

## 主な機能

- 店舗ごとのメニュー一覧表示（開閉式）
- メニューの登録・編集・削除
- 店舗、部位、ブランド豚、価格、説明の管理
- Gemini による自然文からのメニュー情報抽出
- AI の解析結果を確認してからメニューとして登録

> AI 登録で指定する店舗は、あらかじめ `shops` テーブルに登録されている必要があります。店舗名は完全一致で照合されます。

## 技術スタック

- フロントエンド: React 18、JavaScript、Fetch API
- バックエンド: Java 17、Spring Boot 4、Spring Web MVC、Spring Data JPA、Lombok
- AI: Gemini API
- データベース: PostgreSQL / Amazon RDS

## 構成

```text
React
  └─ REST API
       └─ Spring Boot
            ├─ Gemini API
            └─ JPA ─ PostgreSQL
```

## ローカルでの起動

### 前提条件

- Java 17
- Node.js / npm
- PostgreSQL
- Gemini API キー（AI 登録機能を使う場合）
- `shops` と `menus` テーブルを含む `trackdb` データベース

### 1. バックエンド

以下の環境変数を設定します。

| 変数 | 内容 | 既定値 |
| --- | --- | --- |
| `DB_HOST` | PostgreSQL のホスト名 | なし |
| `DB_USER` | PostgreSQL のユーザー名 | なし |
| `DB_PASSWORD` | PostgreSQL のパスワード | なし |
| `GEMINI_API_KEY` | Gemini API キー | なし |
| `PORT` | バックエンドのポート | `8080` |
| `CORS_ALLOWED_ORIGINS` | 許可するオリジン（カンマ区切り） | `http://localhost:3000` ほか |

PowerShell の例：

```powershell
$env:DB_HOST = "localhost"
$env:DB_USER = "postgres"
$env:DB_PASSWORD = "password"
$env:GEMINI_API_KEY = "your-api-key"
cd backend
.\mvnw.cmd spring-boot:run
```

Hibernate は `ddl-auto=validate` で動作するため、テーブルは起動前に作成しておく必要があります。

### 2. フロントエンド

別のターミナルで実行します。

```powershell
cd frontend
npm install
npm start
```

フロントエンドは既定で `http://localhost:3000`、API は `http://localhost:8080` を使用します。API の接続先を変更する場合は `REACT_APP_API_BASE_URL` を設定してください。

## API

| メソッド | パス | 内容 |
| --- | --- | --- |
| `GET` | `/api/hello` | 疎通確認 |
| `GET` | `/api/shops` | 店舗一覧の取得 |
| `GET` | `/api/menus` | メニュー一覧の取得 |
| `POST` | `/api/menus` | メニューの登録 |
| `PUT` | `/api/menus/{id}` | メニューの更新 |
| `DELETE` | `/api/menus/{id}` | メニューの削除 |
| `POST` | `/api/ai/parse-menu` | 自然文からメニュー情報を抽出 |

AI 解析 API のリクエスト例：

```json
{
  "text": "とんかつ野崎にカツカレー2000円を追加して"
}
```
