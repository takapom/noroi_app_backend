# API動作確認ガイド

このドキュメントでは、curlコマンドを使用してAPIの動作を確認する方法を説明します。

## 前提条件

1. サーバーが起動していること
```bash
go run cmd/api/main.go
```

2. データベースがセットアップされていること

## テストフロー

### 1. ヘルスチェック

```bash
curl http://localhost:8080/health
```

期待されるレスポンス: `{"status":"ok"}`

### 2. 呪癖スタイル一覧取得

```bash
curl http://localhost:8080/api/v1/curse-styles
```

### 3. ユーザー登録

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "テストユーザー",
    "password": "password123",
    "age": "25",
    "gender": "male",
    "curseStyle": "infernal"
  }'
```

レスポンスから`access_token`と`refresh_token`をコピーしてください。

### 4. ログイン

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 5. プロフィール取得（認証必要）

```bash
# ACCESS_TOKENを前のステップで取得したトークンに置き換えてください
ACCESS_TOKEN="your-access-token-here"

curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 6. 投稿作成（認証必要）

```bash
curl -X POST http://localhost:8080/api/v1/posts \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "これはテスト投稿です。怨念の力を試してみます。",
    "is_anonymous": false
  }'
```

レスポンスから`id`をコピーしてください。

### 7. タイムライン取得（認証必要）

```bash
curl http://localhost:8080/api/v1/posts?offset=0&limit=20 \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 8. 投稿に怨念（いいね）（認証必要）

```bash
# POST_IDを前のステップで取得したIDに置き換えてください
POST_ID="your-post-id-here"

curl -X POST http://localhost:8080/api/v1/posts/$POST_ID/curse \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 9. 怨念取り消し（認証必要）

```bash
curl -X DELETE http://localhost:8080/api/v1/posts/$POST_ID/curse \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 10. 投稿編集（認証必要）

```bash
curl -X PUT http://localhost:8080/api/v1/posts/$POST_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "編集後の投稿内容です。怨念がより強くなりました。"
  }'
```

### 11. プロフィール更新（認証必要）

```bash
curl -X PUT http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "更新されたユーザー名",
    "age": 26,
    "gender": "male",
    "curse_style_id": ""
  }'
```

### 12. 投稿削除（認証必要）

```bash
curl -X DELETE http://localhost:8080/api/v1/posts/$POST_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 13. トークン更新

```bash
# REFRESH_TOKENを登録時に取得したトークンに置き換えてください
REFRESH_TOKEN="your-refresh-token-here"

curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "'"$REFRESH_TOKEN"'"
  }'
```

## エラーケースのテスト

### 1. 無効なメールアドレスで登録

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "username": "テストユーザー",
    "password": "password123",
    "age": "25",
    "gender": "male",
    "curseStyle": "infernal"
  }'
```

期待されるレスポンス: `400 Bad Request`

### 2. 短すぎるパスワード

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "username": "テストユーザー2",
    "password": "pass",
    "age": "25",
    "gender": "male",
    "curseStyle": "infernal"
  }'
```

期待されるレスポンス: `400 Bad Request`

### 3. 短すぎる投稿

```bash
curl -X POST http://localhost:8080/api/v1/posts \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "短い",
    "is_anonymous": false
  }'
```

期待されるレスポンス: `400 Bad Request`

### 4. 認証なしでprotectedエンドポイントにアクセス

```bash
curl http://localhost:8080/api/v1/users/me
```

期待されるレスポンス: `401 Unauthorized`

### 5. 自分の投稿に怨念

まず別のユーザーを作成し、そのユーザーの投稿に対して同じユーザーで怨念を試みます。

```bash
# 新しいユーザーで投稿作成
POST_ID_NEW="newly-created-post-id"

# 同じユーザーで怨念を試みる
curl -X POST http://localhost:8080/api/v1/posts/$POST_ID_NEW/curse \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

期待されるレスポンス: `400 Bad Request - cannot curse your own post`

## 便利なスクリプト

以下のシェルスクリプトを使用すると、一連のテストを自動化できます。

### full-test.sh

```bash
#!/bin/bash

echo "=== 1. ヘルスチェック ==="
curl http://localhost:8080/health
echo -e "\n"

echo "=== 2. ユーザー登録 ==="
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "username": "テストユーザー",
    "password": "password123",
    "age": "25",
    "gender": "male",
    "curseStyle": "infernal"
  }')

echo $REGISTER_RESPONSE | jq .
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r .access_token)
echo "Access Token: $ACCESS_TOKEN"
echo -e "\n"

echo "=== 3. プロフィール取得 ==="
curl -s http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo -e "\n"

echo "=== 4. 投稿作成 ==="
POST_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/posts \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "これはテスト投稿です。怨念の力を試してみます。",
    "is_anonymous": false
  }')

echo $POST_RESPONSE | jq .
POST_ID=$(echo $POST_RESPONSE | jq -r .id)
echo "Post ID: $POST_ID"
echo -e "\n"

echo "=== 5. タイムライン取得 ==="
curl -s http://localhost:8080/api/v1/posts?offset=0&limit=10 \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo -e "\n"

echo "完了！"
```

このスクリプトを実行可能にするには：

```bash
chmod +x full-test.sh
./full-test.sh
```

注意: `jq`コマンドがインストールされている必要があります。
