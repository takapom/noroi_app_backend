# 呪癖 (JUHEKI) - フロントエンド

関わりたくないが関わってしまう人々への鬱憤を、ゴシックホラーの世界観の中で「呪い」として昇華させる匿名SNSアプリのフロントエンド実装です。

## 🎨 デザインコンセプト

- **テーマ**: ゴシックホラー
- **モチーフ**: 西洋の古い教会、廃墟、魔導書
- **カラー**: 黒やセピアを基調としたダークな色合い
- **フォント**: 装飾的で雰囲気のあるフォント（Cinzel Decorative、Noto Serif JP等）

## 🛠 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **State Management**: Zustand (予定)
- **Icons**: React Icons

## 📦 インストール

```bash
npm install
```

## 🚀 開発サーバー起動

```bash
npm run dev
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

## 📱 実装済み画面

### 1. スプラッシュスクリーン
- アプリ起動時の荘厳な演出
- ゴシック大聖堂のシルエット
- 縦書きアプリ名表示
- 緑の炎のローディングアニメーション

### 2. ログイン画面
- ゴシックアーチ装飾
- メールアドレスと合言葉（パスワード）入力
- 新規登録画面への遷移

### 3. 新規登録画面
- ユーザー情報入力（メール、呪名、合言葉、年齢、性別）
- 呪癖（儀式スタイル）の選択
  - 炎獄の儀式 (Infernal Rite)
  - 氷結の呪縛 (Frozen Curse)
  - 闇夜の囁き (Shadow Whisper)
  - 血盟の刻印 (Blood Covenant)
  - 骸骨の舞踏 (Danse Macabre)

### 4. タイムライン画面
- 他ユーザーの投稿を時系列で表示
- 投稿カードにゴシックホラー装飾
- 怨念！ボタン（いいね機能）
- 固定ヘッダーとボトムナビゲーション
- フローティングアクションボタン（投稿）

### 5. 投稿モーダル
- 呪いの内容入力（最大500文字）
- 匿名性トグル
- 公開範囲選択
- 羊皮紙風テキストエリア

## 🎨 カラーパレット

```css
/* Abyss - 深淵の黒 */
--abyss-950: #0a0a0a;
--abyss-900: #1a1614;
--abyss-800: #2d2520;
--abyss-700: #3f352d;

/* Bloodstain - 血痕の赤 */
--bloodstain-900: #4a0e0e;
--bloodstain-800: #6b1515;
--bloodstain-700: #8b1e1e;
--bloodstain-600: #a52a2a;
--bloodstain-500: #c74040;

/* Bone - 骨灰のセピア */
--bone-100: #f5f1e8;
--bone-200: #e8dcc8;
--bone-300: #d4c4a8;
--bone-400: #b8a688;
--bone-500: #8f7d5f;

/* Cursed Flame - 呪火の緑 */
--cursedflame-900: #1a2e1a;
--cursedflame-800: #2d4a2d;
--cursedflame-700: #3d5e3d;
--cursedflame-600: #4a7c4a;
--cursedflame-500: #5a9a5a;

/* Moonlight - 月光の銀 */
--moonlight-800: #3a3a3a;
--moonlight-700: #4a4a4a;
--moonlight-600: #6a6a6a;
--moonlight-400: #9a9a9a;
```

## 📂 プロジェクト構造

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # ルートレイアウト
│   │   ├── page.tsx         # メインページ（状態管理）
│   │   └── globals.css      # グローバルスタイル（デザインシステム）
│   └── components/
│       ├── SplashScreen.tsx  # スプラッシュスクリーン
│       ├── LoginForm.tsx     # ログインフォーム
│       ├── RegisterForm.tsx  # 新規登録フォーム
│       ├── Timeline.tsx      # タイムライン
│       ├── CurseCard.tsx     # 投稿カード
│       ├── CurseButton.tsx   # 呪うボタン
│       └── PostModal.tsx     # 投稿モーダル
├── public/                   # 静的ファイル
└── package.json
```

## 🔮 今後の実装予定

- [ ] 儀式画面（焼滅の儀）
- [ ] 番付画面（ランキング）
- [ ] マイページ
- [ ] 検索機能
- [ ] 藁人形に釘を打つアニメーション（Lottie）
- [ ] 業火の演出（Lottie/GSAP）
- [ ] バックエンドAPI統合
- [ ] 認証機能（JWT）
- [ ] リアルタイム更新（WebSocket）

## 🎭 開発メモ

### モックデータ
現在、タイムラインは静的なモックデータを表示しています。バックエンドAPIが完成次第、統合予定です。

### 認証
ログイン/登録機能は現在、localStorageを使用した簡易的な実装です。本番環境ではJWTによる認証を実装予定です。

### アニメーション
- Framer Motionを使用した基本的なアニメーションは実装済み
- 複雑な藁人形アニメーションはLottie JSONファイルの作成待ち

## 📄 ライセンス

このプロジェクトは個人開発プロジェクトです。
