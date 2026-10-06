# Tonkatsu DB

とんかつ店とメニューを店舗ごとに管理する Web アプリケーションです。

React のフロントエンドに対して、**Java / Spring Boot と Go / Gin の2種類のバックエンドを実装**しています。  
同一の REST API を利用することで、フロントエンドから接続先を切り替えて動作させることができます。

Spring Boot 版では Gemini API を利用し、自然文からメニュー情報を抽出する AI 登録機能も実装しています。

## Demo

Frontend:

https://main.d7cgaeiwb3kth.amplifyapp.com

公開環境は AWS 上に構築しています。

```text
AWS Amplify
    │
    ▼
React
    │
    ▼
Amazon CloudFront
    │
    ▼
Elastic Beanstalk
    │
    ▼
Go / Gin
    │
    ▼
Amazon RDS for PostgreSQL
```

## 主な機能

- 店舗ごとのメニュー一覧表示
- メニューの登録・編集・削除
- 店舗、部位、ブランド豚、価格、説明の管理
- REST API によるフロントエンド / バックエンド分離
- Java / Spring Boot バックエンド
- Go / Gin バックエンド
- PostgreSQL / Amazon RDS へのデータ永続化
- Gemini API による自然文からのメニュー情報抽出（Spring Boot版）

> AI 登録で指定する店舗は、あらかじめ `shops` テーブルに登録されている必要があります。  
> 店舗名は完全一致で照合されます。

## 技術スタック

### Frontend

- React 18
- JavaScript
- Fetch API
- AWS Amplify

### Backend - Java

- Java 17
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA
- Lombok
- Gemini API

### Backend - Go

- Go
- Gin
- pgx
- REST API

### Database / Infrastructure

- PostgreSQL
- Amazon RDS
- AWS Elastic Beanstalk
- Amazon CloudFront
- AWS Amplify

## ディレクトリ構成

```text
tonkatsu-db/
├─ frontend/            # React
├─ backend/             # Java / Spring Boot
├─ backend-go/          # Go / Gin
└─ README.md
```

## アプリケーション構成

### Spring Boot版

```text
React
  │
  └─ REST API
       │
       ▼
   Spring Boot
       ├─ Gemini API
       └─ JPA
            │
            ▼
       PostgreSQL
```

### Go版

```text
React
  │
  └─ REST API
       │
       ▼
     Gin
       │
      pgx
       │
       ▼
 PostgreSQL
```

フロントエンドは `REACT_APP_API_BASE_URL` により接続先を変更できます。

そのため、同じ React アプリケーションから Spring Boot版 / Go版のバックエンドを切り替えて利用できます。

## API

### 共通API

| メソッド | パス | 内容 |
| --- | --- | --- |
| `GET` | `/api/shops` | 店舗一覧の取得 |
| `GET` | `/api/menus` | メニュー一覧の取得 |
| `POST` | `/api/menus` | メニューの登録 |
| `PUT` | `/api/menus/{id}` | メニューの更新 |
| `DELETE` | `/api/menus/{id}` | メニューの削除 |

### Spring Boot版

| メソッド | パス | 内容 |
| --- | --- | --- |
| `GET` | `/api/hello` | 疎通確認 |
| `POST` | `/api/ai/parse-menu` | 自然文からメニュー情報を抽出 |

### Go版

| メソッド | パス | 内容 |
| --- | --- | --- |
| `GET` | `/health` | ヘルスチェック |

## ローカルでの起動

### 前提条件

- Java 17
- Go
- Node.js / npm
- PostgreSQL
- Gemini API キー（Spring Boot版のAI登録機能を使用する場合）
- `shops` と `menus` テーブルを含む `trackdb` データベース

## Spring Boot バックエンド

以下の環境変数を設定します。

| 変数 | 内容 |
| --- | --- |
| `DB_HOST` | PostgreSQL のホスト名 |
| `DB_USER` | PostgreSQL のユーザー名 |
| `DB_PASSWORD` | PostgreSQL のパスワード |
| `GEMINI_API_KEY` | Gemini API キー |
| `PORT` | バックエンドのポート |
| `CORS_ALLOWED_ORIGINS` | 許可するオリジン |

PowerShell の例:

```powershell
$env:DB_HOST = "localhost"
$env:DB_USER = "postgres"
$env:DB_PASSWORD = "password"
$env:GEMINI_API_KEY = "your-api-key"

cd backend
.\mvnw.cmd spring-boot:run
```

Hibernate は `ddl-auto=validate` で動作するため、テーブルは起動前に作成しておく必要があります。

## Go バックエンド

Go版では PostgreSQL への接続に `DATABASE_URL` を使用します。

Git Bash の例:

```bash
export DATABASE_URL="postgres://postgres:password@localhost:5432/trackdb?sslmode=disable"

cd backend-go
go run ./cmd/api
```

デフォルトではポート `8080` で起動します。

確認:

```bash
curl http://localhost:8080/health
```

```json
{
  "status": "ok"
}
```

## Frontend

```bash
cd frontend
npm install
npm start
```

API の接続先は `REACT_APP_API_BASE_URL` で指定します。

Spring Boot を利用する例:

```bash
REACT_APP_API_BASE_URL=http://localhost:8080 npm start
```

Go を利用する例:

```bash
REACT_APP_API_BASE_URL=http://localhost:8080 npm start
```

ポートを分けて起動する場合は、それぞれのバックエンドURLを指定してください。

## AI メニュー登録

Spring Boot版では Gemini API を利用して自然文からメニュー情報を抽出できます。

リクエスト例:

```json
{
  "text": "とんかつ野崎にカツカレー2000円を追加して"
}
```

解析結果をそのまま登録するのではなく、ユーザーが内容を確認した上でメニューとして登録する構成にしています。

## 実装目的

このリポジトリでは、単純なCRUDアプリケーションだけでなく、

- React と REST API の分離
- Java / Spring Boot によるバックエンド実装
- Go / Gin によるバックエンド再実装
- JPA と SQLベースのデータアクセスの比較
- AWS 上でのフロントエンド / API / DB の構築
- 生成AI API のアプリケーションへの組み込み

を実際に実装しながら検証しています。