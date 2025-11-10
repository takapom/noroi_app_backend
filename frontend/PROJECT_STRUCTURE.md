# プロジェクト構造 (最適化後)

## ディレクトリ構造

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               ✅ Server Component (メタデータ、フォント)
│   │   └── page.tsx                 ✅ Server Component (ルートページ)
│   │
│   ├── components/                   # UIコンポーネント
│   │   ├── AuthWrapper.tsx          🔵 Client Component (認証フロー管理)
│   │   ├── SplashScreen.tsx         🔵 Client Component (Framer Motion)
│   │   ├── LoginForm.tsx            🔵 Client Component (useState, form)
│   │   ├── RegisterForm.tsx         🔵 Client Component (useState, form)
│   │   ├── MainApp.tsx              🔵 Client Component (アプリナビゲーション)
│   │   ├── CurseButton.tsx          🔵 Client Component (Framer Motion)
│   │   ├── CurseCard.tsx            🔵 Client Component (useState, Framer Motion)
│   │   ├── PostModal.tsx            🔵 Client Component (useState, AnimatePresence)
│   │   ├── Timeline.tsx             🔵 Client Component (useState)
│   │   │
│   │   ├── profile/
│   │   │   ├── Profile.tsx          🟢 Wrapper Component (委譲のみ)
│   │   │   ├── ProfileClient.tsx    🔵 Client Component (Framer Motion)
│   │   │   └── ProfileContent.tsx   🟡 準備済み (将来Server Component化可能)
│   │   │
│   │   ├── ranking/
│   │   │   ├── Ranking.tsx          🔵 Client Component (useState)
│   │   │   └── RankingList.tsx      🟡 準備済み (将来Server Component化可能)
│   │   │
│   │   ├── ritual/
│   │   │   ├── RitualWaiting.tsx    🔵 Client Component (useEffect, タイマー)
│   │   │   └── RitualActive.tsx     🔵 Client Component (useState, AnimatePresence)
│   │   │
│   │   └── settings/
│   │       └── Settings.tsx         🔵 Client Component (useState, form)
│   │
│   ├── lib/                          # ユーティリティ・データレイヤー
│   │   └── data.ts                  ✅ Server-side データフェッチング関数
│   │
│   └── types/                        # 型定義
│       └── index.ts                 ✅ 共通型定義
│
├── OPTIMIZATION_REPORT.md            📄 詳細な最適化レポート
├── CHANGES_SUMMARY.md                📄 変更サマリー
└── PROJECT_STRUCTURE.md              📄 このファイル
```

## 凡例

| アイコン | 意味 |
|---------|------|
| ✅ | **Server Component** - サーバー側でレンダリング |
| 🔵 | **Client Component** - クライアント側でレンダリング必須 |
| 🟡 | **準備済み** - 将来Server Component化可能 |
| 🟢 | **Wrapper** - 処理を委譲するのみ |

---

## コンポーネント分類

### Server Components (✅)

#### `app/layout.tsx`
- **役割**: ルートレイアウト、メタデータ、フォント読み込み
- **理由**: 静的な設定のみ、Client-side機能不要

#### `app/page.tsx`
- **役割**: ルートページ、AuthWrapperの呼び出し
- **理由**: 将来的にデータフェッチングをここで実行可能
- **最適化ポイント**: 静的生成(Static)に成功

#### `lib/data.ts`
- **役割**: データフェッチング関数群
- **理由**: Server Componentsで使用するためのAPI層
- **将来**: 実際のAPIエンドポイントに接続

#### `types/index.ts`
- **役割**: 共通型定義
- **理由**: サーバー・クライアント両方で使用

---

### Client Components (🔵)

#### 認証・ナビゲーション

**`AuthWrapper.tsx`**
- **Client必須理由**: localStorage、useState、useEffect
- **役割**: 認証フロー管理 (Splash → Login/Register → Timeline)

**`MainApp.tsx`**
- **Client必須理由**: useState (タブ切替)
- **役割**: タイムライン、儀式、ランキング、プロフィールのナビゲーション

#### フォーム関連

**`LoginForm.tsx`**
- **Client必須理由**: useState (email, password)、onChange handlers
- **役割**: ログインフォーム

**`RegisterForm.tsx`**
- **Client必須理由**: useState (formData)、onChange handlers
- **役割**: 新規登録フォーム

**`PostModal.tsx`**
- **Client必須理由**: useState (content, isAnonymous)、AnimatePresence
- **役割**: 新規投稿モーダル

**`Settings.tsx`**
- **Client必須理由**: useState (複数のフォーム状態)
- **役割**: 設定画面

#### アニメーション・UI

**`SplashScreen.tsx`**
- **Client必須理由**: Framer Motion、useEffect (timer)
- **役割**: 起動時のスプラッシュ画面

**`CurseButton.tsx`**
- **Client必須理由**: Framer Motion (whileHover, whileTap)
- **役割**: 共通ボタンコンポーネント

**`CurseCard.tsx`**
- **Client必須理由**: useState (hover state)、Framer Motion
- **役割**: 投稿カード

#### タイムライン・コンテンツ

**`Timeline.tsx`**
- **Client必須理由**: useState (posts, like toggle)
- **役割**: タイムライン表示

**`ranking/Ranking.tsx`**
- **Client必須理由**: useState (tab selection)
- **役割**: ランキング表示

**`profile/ProfileClient.tsx`**
- **Client必須理由**: Framer Motion (アニメーション)
- **役割**: プロフィールのアニメーション部分

#### 儀式関連

**`ritual/RitualWaiting.tsx`**
- **Client必須理由**: useEffect (countdown timer)、useState
- **役割**: 儀式待機画面

**`ritual/RitualActive.tsx`**
- **Client必須理由**: useState、AnimatePresence
- **役割**: 儀式進行中画面

---

### 準備済みコンポーネント (🟡)

#### `ranking/RankingList.tsx`
- **現状**: 未使用
- **将来**: Ranking.tsx を分離し、表示部分のみServer Component化
- **条件**: Framer Motionの削除が必要

#### `profile/ProfileContent.tsx`
- **現状**: 未使用
- **将来**: ProfileClient.tsx から表示部分を分離
- **条件**: Framer Motionの削除が必要

---

## データフロー

### 現在のフロー (CSR中心)

```
Browser
  └── AuthWrapper (Client)
       ├── localStorage check
       ├── SplashScreen (Client)
       ├── LoginForm (Client)
       ├── RegisterForm (Client)
       └── MainApp (Client)
            ├── Timeline (Client)
            │    └── CurseCard (Client)
            ├── Ranking (Client)
            ├── Profile (Client)
            └── Settings (Client)
```

### 将来の最適化フロー (SSR/RSC活用)

```
Server
  └── page.tsx (Server Component)
       ├── getTimelinePosts() ← Server-side fetch
       ├── getRankings() ← Server-side fetch
       └── getUserProfile() ← Server-side fetch
            ↓ (data passed as props)
       AuthWrapper (Client)
            └── MainApp (Client)
                 ├── TimelineClient (Client)
                 │    ├── initialPosts (from server)
                 │    └── CurseCard (Client)
                 ├── RankingClient (Client)
                 │    └── RankingList (Server) ← 表示のみ
                 └── ProfileClient (Client)
                      └── ProfileContent (Server) ← 表示のみ
```

---

## ファイルサイズと最適化

### 最適化前
- ほぼ全てのコンポーネントが `'use client'`
- 初期JavaScriptバンドルに全て含まれる
- ページ全体がCSR

### 最適化後
- `page.tsx`: Server Component ✅
- `layout.tsx`: Server Component ✅
- 他: 必要最小限のみClient Component

### ビルド結果
```
Route (app)
┌ ○ /              (Static)  ← 静的生成
└ ○ /_not-found    (Static)
```

---

## 開発ガイドライン

### 新しいコンポーネントを作成する際のチェックリスト

1. **まずServer Componentで考える**
   ```typescript
   // デフォルトは Server Component
   export default function MyComponent() {
     return <div>...</div>;
   }
   ```

2. **Client Componentが必要か確認**
   - [ ] useState を使う?
   - [ ] useEffect を使う?
   - [ ] onClick, onChange などのイベントハンドラ?
   - [ ] Framer Motion?
   - [ ] localStorage, window などのブラウザAPI?

3. **必要な場合のみ 'use client' を追加**
   ```typescript
   'use client';
   export default function MyComponent() {
     const [state, setState] = useState(...);
     return <div onClick={...}>...</div>;
   }
   ```

4. **データフェッチングは lib/data.ts に追加**
   ```typescript
   // lib/data.ts
   export async function getMyData(): Promise<MyDataType> {
     // API call
   }
   ```

5. **型定義は types/index.ts に追加**
   ```typescript
   // types/index.ts
   export interface MyDataType {
     // ...
   }
   ```

---

## まとめ

現在のアーキテクチャは、Next.js 16 App Routerの機能を最大限活用できる基盤が整っています。

**主な成果**:
- page.tsx のServer Component化 ✅
- データフェッチング層の整備 ✅
- 型定義の一元化 ✅
- 静的生成の実現 ✅

**次のステップ**:
1. データフェッチング関数の実装
2. さらなるコンポーネント分離
3. Framer Motionの段階的削除
4. Streaming SSRの活用

詳細は以下のドキュメントを参照:
- **詳細レポート**: `OPTIMIZATION_REPORT.md`
- **変更サマリー**: `CHANGES_SUMMARY.md`
