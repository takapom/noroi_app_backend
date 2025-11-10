# バックエンドセットアップ完了

## 完了した作業

### 1. ドメインモデルの実装 ✅

#### エンティティ
- `User` - ユーザー（認証、プロフィール、ポイント）
- `CurseStyle` - 呪癖スタイル（基本5種 + 特別な呪癖）
- `Post` - 投稿（通常投稿 + イベント投稿）
- `Curse` - 怨念（いいね機能）
- `Ritual` - 儀式（焼滅の儀）
- `RitualParticipant` - 儀式参加者（ダメージ記録、ランキング）
- `Ranking` - ランキング（週間/月間/全期間）

#### 値オブジェクト
- `Email` - メールアドレス（バリデーション付き）
- `Password` - パスワード（bcryptハッシュ化）
- `PostContent` - 投稿内容（10-300文字）

### 2. データベーススキーマ ✅

作成されたテーブル：
- `users` - ユーザー情報
- `curse_styles` - 呪癖スタイル（初期5種挿入済み）
- `posts` - 投稿
- `curses` - 怨念
- `rituals` - 儀式
- `ritual_participants` - 儀式参加者
- `rankings` - ランキング

### 3. Docker環境 ✅

#### サービス
- **PostgreSQL 15** - ポート 5433 で起動
- **Migration** - マイグレーション実行済み
- **API** - ポート 8081 で起動

#### 確認コマンド
```bash
# サービス状態確認
docker-compose ps

# ログ確認
docker-compose logs -f

# データベース接続
docker exec -it noroi_db psql -U noroi -d noroi_db

# API ヘルスチェック
curl http://localhost:8081/health
```

## 現在の状態

### データベース
- ✅ PostgreSQL 15 が起動中
- ✅ 全テーブル作成完了
- ✅ 初期データ（呪癖5種）挿入完了
- ✅ インデックス設定完了
- ✅ トリガー設定完了（updated_at自動更新）

### API
- ✅ Go APIサーバー起動中
- ✅ ヘルスチェックエンドポイント動作確認済み
- ✅ ポート 8081 でアクセス可能

## 次のステップ（推奨）

### Phase 1: リポジトリ層の実装
- PostgreSQL接続設定
- 各エンティティのリポジトリインターフェース
- リポジトリの実装

### Phase 2: ユースケース層の実装
- ユーザー登録/ログイン
- 投稿のCRUD
- 怨念（いいね）機能
- 儀式管理
- ランキング集計

### Phase 3: インフラ層の実装
- JWT認証ミドルウェア
- HTTPハンドラー
- RESTful APIエンドポイント
- エラーハンドリング

### Phase 4: バッチ処理
- 儀式の自動開始/終了（cron）
- ランキング集計（2時間毎）
- クリティカルヒット判定（10%）

## 環境変数

`.env.example` をコピーして `.env` を作成：
```bash
cp .env.example .env
```

主要な環境変数：
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `RITUAL_MAX_HP=300000`
- `RITUAL_POST_DAMAGE=1000`
- `RITUAL_CRITICAL_RATE=0.1`

## 便利なMakeコマンド

```bash
make help              # コマンド一覧表示
make docker-up         # 全サービス起動
make docker-down       # 全サービス停止
make docker-logs       # ログ表示
make migrate-up        # マイグレーション実行
make migrate-down      # マイグレーションロールバック
make build             # APIビルド
make run               # API実行（ローカル）
```

## アーキテクチャ

```
backend/
├── cmd/api/              # エントリーポイント
├── internal/
│   ├── domain/           # ドメイン層 ✅
│   │   ├── entity/       # エンティティ（7種類）
│   │   └── value/        # 値オブジェクト（3種類）
│   ├── usecase/          # ユースケース層（次のステップ）
│   ├── repository/       # リポジトリIF（次のステップ）
│   └── infrastructure/   # インフラ層（次のステップ）
├── migrations/           # DBマイグレーション ✅
└── pkg/                  # 共通パッケージ ✅
    ├── errors/           # エラー定義
    ├── jwt/              # JWT処理（未実装）
    └── validator/        # バリデーション（未実装）
```

## トラブルシューティング

### ポート競合
- DB: 5432 → 5433
- API: 8080 → 8081

### コンテナ再起動
```bash
docker-compose down
docker-compose up -d
```

### マイグレーション再実行
```bash
docker-compose run --rm migrate -path /migrations -database "postgres://noroi:noroi_password@db:5432/noroi_db?sslmode=disable" down
docker-compose run --rm migrate -path /migrations -database "postgres://noroi:noroi_password@db:5432/noroi_db?sslmode=disable" up
```

## 実装完了日
2025年11月11日
