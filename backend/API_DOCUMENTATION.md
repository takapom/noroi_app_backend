# 呪癖 (Noroi) API Documentation

バックエンドAPIのドキュメントです。

## 環境構築

### 前提条件
- Go 1.21以上
- PostgreSQL 14以上
- Docker & Docker Compose (オプション)

### セットアップ

1. 依存関係のインストール
```bash
go mod download
```

2. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して適切な値を設定
```

3. データベースのマイグレーション
```bash
# migrate CLIをインストール
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# マイグレーション実行
migrate -path migrations -database "postgresql://noroi:noroi_password@localhost:5432/noroi_db?sslmode=disable" up
```

4. サーバー起動
```bash
go run cmd/api/main.go
```

## API エンドポイント

ベースURL: `http://localhost:8080/api/v1`

### 認証

#### ユーザー登録
```
POST /auth/register
```

**リクエストボディ:**
```json
{
  "email": "user@example.com",
  "username": "ユーザー名",
  "password": "password123",
  "age": "25",
  "gender": "male",
  "curseStyle": "infernal"
}
```

**gender の値:**
- `male`: 男性
- `female`: 女性
- `unknown`: その他/未回答

**curseStyle の値:**
- `infernal`: 炎獄の儀式
- `frozen`: 氷結の呪縛
- `shadow`: 闇夜の囁き
- `blood`: 血盟の刻印
- `danse`: 骸骨の舞踏

**レスポンス:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "ユーザー名",
    "age": 25,
    "gender": "male",
    "curse_style_id": "uuid",
    "points": 0
  },
  "access_token": "jwt-token",
  "refresh_token": "jwt-refresh-token"
}
```

#### ログイン
```
POST /auth/login
```

**リクエストボディ:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "ユーザー名",
    "age": 25,
    "gender": "male",
    "curse_style_id": "uuid",
    "points": 0
  },
  "access_token": "jwt-token",
  "refresh_token": "jwt-refresh-token"
}
```

#### トークン更新
```
POST /auth/refresh
```

**リクエストボディ:**
```json
{
  "refresh_token": "jwt-refresh-token"
}
```

**レスポンス:**
```json
{
  "access_token": "new-jwt-token"
}
```

### 投稿

**注意:** 以下のエンドポイントには認証が必要です。Authorizationヘッダーに`Bearer {access_token}`を設定してください。

#### タイムライン取得
```
GET /posts?offset=0&limit=20
```

**クエリパラメータ:**
- `offset`: 開始位置 (デフォルト: 0)
- `limit`: 取得件数 (デフォルト: 20, 最大: 100)

**レスポンス:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "username": "ユーザー名",
      "avatar": "",
      "timestamp": "2時間前",
      "content": "投稿内容",
      "likeCount": 10,
      "commentCount": 0,
      "isLiked": false
    }
  ]
}
```

#### 投稿作成
```
POST /posts
```

**リクエストボディ:**
```json
{
  "content": "投稿内容（10〜300文字）",
  "is_anonymous": false
}
```

**レスポンス:**
```json
{
  "id": "uuid",
  "username": "ユーザー名",
  "avatar": "",
  "timestamp": "たった今",
  "content": "投稿内容",
  "likeCount": 0,
  "commentCount": 0,
  "isLiked": false
}
```

#### 投稿編集
```
PUT /posts/:id
```

**リクエストボディ:**
```json
{
  "content": "更新後の投稿内容（10〜300文字）"
}
```

**レスポンス:**
```json
{
  "message": "post updated successfully"
}
```

#### 投稿削除
```
DELETE /posts/:id
```

**レスポンス:**
```json
{
  "message": "post deleted successfully"
}
```

### 怨念（いいね）

#### 怨念する
```
POST /posts/:id/curse
```

**レスポンス:**
```json
{
  "message": "post cursed successfully"
}
```

#### 怨念を取り消す
```
DELETE /posts/:id/curse
```

**レスポンス:**
```json
{
  "message": "post uncursed successfully"
}
```

### ユーザー

#### プロフィール取得
```
GET /users/me
```

**レスポンス:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "ユーザー名",
  "age": 25,
  "gender": "male",
  "curse_style_id": "uuid",
  "points": 100
}
```

#### プロフィール更新
```
PUT /users/me
```

**リクエストボディ:**
```json
{
  "username": "新しいユーザー名",
  "age": 26,
  "gender": "male",
  "curse_style_id": "uuid"
}
```

**レスポンス:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "新しいユーザー名",
  "age": 26,
  "gender": "male",
  "curse_style_id": "uuid",
  "points": 100
}
```

### 呪癖スタイル

#### 呪癖スタイル一覧取得
```
GET /curse-styles
```

**レスポンス:**
```json
{
  "curse_styles": [
    {
      "id": "uuid",
      "name": "炎獄の儀式",
      "name_en": "Infernal Rite",
      "description": "業火で全てを焼き尽くす激情の呪術",
      "is_special": false,
      "point_cost": 0
    },
    {
      "id": "uuid",
      "name": "氷結の呪縛",
      "name_en": "Frozen Curse",
      "description": "凍てつく憎悪で対象を封じ込める",
      "is_special": false,
      "point_cost": 0
    }
  ]
}
```

## エラーレスポンス

すべてのエラーは以下の形式で返されます：

```json
{
  "error": "エラーメッセージ"
}
```

### HTTPステータスコード

- `200 OK`: 成功
- `201 Created`: 作成成功
- `400 Bad Request`: 不正なリクエスト
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 権限エラー
- `404 Not Found`: リソースが見つからない
- `409 Conflict`: 競合エラー（例：メールアドレス重複）
- `500 Internal Server Error`: サーバーエラー

## 認証について

### JWTトークン

- **アクセストークン有効期限:** 24時間
- **リフレッシュトークン有効期限:** 7日間

### 認証ヘッダー

保護されたエンドポイントにアクセスする際は、以下のヘッダーを含めてください：

```
Authorization: Bearer {access_token}
```

## 投稿仕様

- **最小文字数:** 10文字
- **最大文字数:** 300文字
- **匿名投稿:** 可能（ユーザー名が「匿名」として表示）
- **編集・削除:** 投稿者本人のみ可能

## 怨念（いいね）仕様

- 1ユーザーが同じ投稿に1回のみ
- 自分の投稿には怨念できない
- 取り消し可能

## 開発

### テスト実行
```bash
go test ./...
```

### ビルド
```bash
go build -o bin/api cmd/api/main.go
```

### Docker Compose
```bash
docker-compose up -d
```
