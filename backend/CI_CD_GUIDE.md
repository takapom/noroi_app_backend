# バックエンド CI/CD ガイド

## 目次
1. [CI/CDとは？](#cicdとは)
2. [セットアップ](#セットアップ)
3. [ワークフローの仕組み](#ワークフローの仕組み)
4. [使い方](#使い方)
5. [トラブルシューティング](#トラブルシューティング)
6. [よくある質問](#よくある質問)

---

## CI/CDとは？

### CI (Continuous Integration) - 継続的インテグレーション
コードを変更するたびに、**自動的に**以下を実行します：
- ✅ コードのフォーマットチェック
- ✅ 静的解析（コードの品質チェック）
- ✅ テストの実行
- ✅ ビルドの確認

**メリット**：
- バグを早期発見できる
- コードの品質が保たれる
- チーム開発で安心してコードを統合できる

### CD (Continuous Deployment) - 継続的デプロイ
テストが成功したら、**自動的に**本番環境へデプロイします。

**メリット**：
- 手作業のミスを防げる
- リリースが高速化される
- いつでもデプロイ可能な状態を保てる

---

## セットアップ

### 必要なもの
- GitHub アカウント
- このリポジトリへのpush権限

### 初回設定（すでに完了しています！）

以下のファイルが作成されました：

```
noroi_app/
├── .github/
│   └── workflows/
│       └── backend-ci.yml      # ← CI/CDの設定ファイル
└── backend/
    └── .golangci.yml           # ← コード品質チェックの設定
```

**追加設定不要！** これだけで自動的にCI/CDが動き始めます。

### オプション設定

#### 1. コードカバレッジレポート（Codecov）
コードのテストカバレッジを可視化したい場合：

1. [Codecov](https://codecov.io/) にサインアップ
2. リポジトリを連携
3. トークンを取得
4. GitHubリポジトリの Settings → Secrets → Actions で設定：
   - Name: `CODECOV_TOKEN`
   - Value: 取得したトークン

#### 2. Docker Hubへの自動プッシュ
Dockerイメージを自動でDocker Hubにアップロードしたい場合：

1. Docker Hubアカウントを作成
2. GitHubリポジトリの Settings → Secrets → Actions で設定：
   - `DOCKER_USERNAME`: Docker Hubのユーザー名
   - `DOCKER_PASSWORD`: Docker Hubのパスワード（またはアクセストークン）
3. `.github/workflows/backend-ci.yml` の該当部分のコメントを外す：

```yaml
# この部分のコメント(#)を外す
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

---

## ワークフローの仕組み

### いつ実行されるか？

1. **プルリクエストを作成したとき**
   - `backend/` 内のファイルが変更された場合のみ
   - mainまたはdevelopブランチ向けのPR

2. **mainブランチにpushしたとき**
   - `backend/` 内のファイルが変更された場合のみ

3. **手動実行**
   - GitHub Actions タブから手動でトリガー可能

### 実行される順序

```
開始
 ↓
┌─────────────────────────────────────┐
│ 1. Lint (静的解析)                  │ ← 並列実行
│    - フォーマットチェック            │
│    - コード品質チェック              │
├─────────────────────────────────────┤
│ 2. Test (テスト)                     │ ← 並列実行
│    - PostgreSQL起動                  │
│    - マイグレーション実行            │
│    - テスト実行                      │
├─────────────────────────────────────┤
│ 3. Security (セキュリティスキャン)   │ ← 並列実行
│    - 脆弱性チェック                  │
└─────────────────────────────────────┘
 ↓ (全て成功したら)
┌─────────────────────────────────────┐
│ 4. Build (ビルド)                    │
│    - 複数プラットフォーム向けビルド  │
│    - バイナリを保存                  │
└─────────────────────────────────────┘
 ↓ (mainブランチの場合のみ)
┌─────────────────────────────────────┐
│ 5. Docker (Dockerイメージ作成)      │
│    - Dockerイメージビルド            │
│    - Docker Hub へプッシュ(オプション)│
└─────────────────────────────────────┘
 ↓
完了 ✅
```

### 各ジョブの詳細

#### 1. Lint（静的解析） - 約2分
**何をするか？**
- コードが正しくフォーマットされているかチェック
- `go.mod`と`go.sum`が最新かチェック
- コードの品質問題を検出（未使用変数、非効率なコードなど）

**失敗する例**：
```go
// ❌ フォーマットされていない
func main(){
fmt.Println("hello")
}

// ✅ 正しいフォーマット
func main() {
    fmt.Println("hello")
}
```

**修正方法**：
```bash
cd backend
go fmt ./...
go mod tidy
```

#### 2. Test（テスト） - 約3-5分
**何をするか？**
- PostgreSQLデータベースを起動
- データベースマイグレーションを実行
- 全てのテストを実行
- テストカバレッジを計算

**失敗する例**：
- テストコードにバグがある
- データベース接続に失敗
- マイグレーションエラー

**修正方法**：
```bash
cd backend
make test  # ローカルでテストを実行
```

#### 3. Security（セキュリティスキャン） - 約1-2分
**何をするか？**
- SQLインジェクション、XSSなどの脆弱性を検出
- 安全でない関数の使用をチェック
- セキュリティのベストプラクティスを確認

**警告例**：
```go
// ⚠️ 警告: 弱い乱数生成器
password := rand.Intn(10000)

// ✅ 推奨: 暗号学的に安全な乱数
password, _ := rand.Int(rand.Reader, big.NewInt(10000))
```

#### 4. Build（ビルド） - 約2-3分
**何をするか？**
- 以下のプラットフォーム向けにビルド：
  - Linux AMD64（サーバー用）
  - macOS AMD64（Intel Mac用）
  - macOS ARM64（M1/M2 Mac用）
- ビルドしたバイナリを7日間保存

**成果物のダウンロード**：
GitHub Actions タブ → 該当のワークフロー → Artifacts

#### 5. Docker（Dockerイメージ） - 約3-5分
**何をするか？**（mainブランチのみ）
- Dockerイメージをビルド
- タグ付け（`latest`と`コミットハッシュ`）
- Docker Hubへプッシュ（オプション）

---

## 使い方

### 基本的な開発フロー

#### ステップ1: ブランチを作成
```bash
git checkout -b feature/新機能名
```

#### ステップ2: コードを書く
```bash
cd backend
# コードを編集...
```

#### ステップ3: ローカルでテスト
```bash
# フォーマット
go fmt ./...

# 依存関係の整理
go mod tidy

# テスト実行
make test

# 静的解析（オプション）
golangci-lint run
```

#### ステップ4: コミット＆プッシュ
```bash
git add .
git commit -m "機能: 新機能を追加"
git push origin feature/新機能名
```

#### ステップ5: プルリクエスト作成
1. GitHubでプルリクエストを作成
2. **自動的にCI/CDが実行される**
3. 結果を確認：
   - ✅ 全てグリーン → マージOK
   - ❌ 赤いX → エラーを修正

#### ステップ6: 結果を確認
GitHub上で以下が表示されます：

```
✅ Lint and Format Check - passed
✅ Run Tests - passed
✅ Security Scan - passed
✅ Build Application - passed
```

#### ステップ7: マージ
全てのチェックが通ったら、mainブランチにマージ！

---

## GitHub Actionsの確認方法

### 1. GitHubリポジトリページを開く

### 2. 「Actions」タブをクリック
上部のタブから「Actions」を選択

### 3. ワークフローの実行状況を確認
- 🟢 緑のチェック → 成功
- 🔴 赤いX → 失敗
- 🟡 黄色の丸 → 実行中

### 4. 詳細を見る
ワークフロー名をクリック → ジョブをクリック → ログを確認

---

## トラブルシューティング

### ❌ Lint エラー

#### エラー: "ファイルがフォーマットされていません"
```bash
cd backend
go fmt ./...
git add .
git commit -m "fix: フォーマット修正"
git push
```

#### エラー: "go.mod または go.sum が最新ではありません"
```bash
cd backend
go mod tidy
git add go.mod go.sum
git commit -m "fix: 依存関係を更新"
git push
```

#### エラー: golangci-lint の警告
```bash
cd backend
golangci-lint run
# 警告内容を確認して修正
```

### ❌ Test エラー

#### エラー: テストが失敗する
```bash
cd backend
make test
# どのテストが失敗したか確認
# テストコードまたは実装を修正
```

#### エラー: データベース接続エラー
- ローカルでPostgreSQLが起動しているか確認
- マイグレーションファイルが正しいか確認

```bash
make docker-up
make migrate-up
```

### ❌ Build エラー

#### エラー: ビルドに失敗
```bash
cd backend
go build ./cmd/api
# エラーメッセージを確認して修正
```

### 🔧 ローカルでCI/CDと同じチェックを実行

すべてのチェックをローカルで実行するスクリプト：

```bash
#!/bin/bash
# check-ci.sh

echo "🔍 フォーマットチェック..."
gofmt -l . | grep . && exit 1 || echo "✅ OK"

echo "🔍 go mod チェック..."
go mod tidy
git diff --exit-code go.mod go.sum || exit 1
echo "✅ OK"

echo "🔍 静的解析..."
golangci-lint run || exit 1
echo "✅ OK"

echo "🧪 テスト実行..."
go test -v -race ./... || exit 1
echo "✅ OK"

echo "🔨 ビルド..."
go build ./cmd/api || exit 1
echo "✅ OK"

echo "🎉 全てのチェックが通りました！"
```

使い方：
```bash
cd backend
chmod +x check-ci.sh
./check-ci.sh
```

---

## よくある質問

### Q1: CI/CDが実行されない
**A:** 以下を確認してください：
- `backend/` ディレクトリ内のファイルを変更しましたか？
- プルリクエストのターゲットは `main` または `develop` ブランチですか？
- ワークフローファイルに構文エラーはありませんか？

### Q2: ワークフローを手動で実行したい
**A:**
1. GitHubの「Actions」タブを開く
2. 左サイドバーから「Backend CI/CD」を選択
3. 右上の「Run workflow」ボタンをクリック
4. ブランチを選択して「Run workflow」

### Q3: 特定のジョブだけスキップしたい
**A:** ワークフローファイルを編集：
```yaml
# 該当ジョブに追加
if: false  # このジョブを無効化
```

### Q4: テストが遅い
**A:** 並列実行を活用：
```bash
go test -v -race -parallel 4 ./...
```

### Q5: ローカルとCI/CDで結果が違う
**A:** 以下を確認：
- Goのバージョンが同じか（`go version`）
- 環境変数の違い
- データベースの状態

### Q6: セキュリティスキャンの警告を無視したい
**A:** `.golangci.yml` で除外設定：
```yaml
linters-settings:
  gosec:
    excludes:
      - G404  # 該当のルール番号
```

---

## ベストプラクティス

### ✅ やるべきこと
1. **ローカルでテスト**してからpush
2. **小さい単位**でコミット
3. **意味のある**コミットメッセージを書く
4. プルリクエストに**説明**を書く
5. CI/CDの結果を**必ず確認**

### ❌ 避けるべきこと
1. テストをスキップしてpush
2. CI/CDが失敗したまま放置
3. フォーマットされていないコードをpush
4. mainブランチに直接push（緊急時以外）
5. エラーメッセージを読まずに再実行

---

## 参考リンク

- [GitHub Actions ドキュメント](https://docs.github.com/ja/actions)
- [golangci-lint](https://golangci-lint.run/)
- [Go テストのベストプラクティス](https://go.dev/doc/tutorial/add-a-test)
- [Docker Hub](https://hub.docker.com/)
- [Codecov](https://about.codecov.io/)

---

## 次のステップ

CI/CDが動いたら、以下を検討してみてください：

1. **自動デプロイの追加**
   - AWS、GCP、Herokuなどへの自動デプロイ

2. **通知の設定**
   - Slack、Discordへの結果通知

3. **パフォーマンステスト**
   - ベンチマークの自動実行

4. **リリースの自動化**
   - タグをpushしたら自動でリリースノート作成

5. **スケジュール実行**
   - 夜間に定期的にテストを実行

---

## まとめ

このCI/CDワークフローにより：
- ✅ コードの品質が自動的に保たれる
- ✅ バグを早期に発見できる
- ✅ 安心してコードをマージできる
- ✅ デプロイが簡単になる

**最初は難しく感じるかもしれませんが、一度設定すれば自動で動いてくれます！**

何か問題があれば、GitHub Actionsのログを確認するか、このガイドを参照してください。

Happy Coding! 🚀
