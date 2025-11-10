# Next.js 16 パフォーマンス最適化 - 変更サマリー

## 変更ファイル一覧

### 1. 変更されたファイル

#### `/Users/yuki.takagi/Desktop/noroi/frontend/src/app/page.tsx`
**変更内容**: `'use client'` を削除し、Server Component化

**変更前**:
```typescript
'use client';
export default function Home() {
  const [appState, setAppState] = useState<AppState>('splash');
  useEffect(() => { ... });
  // ... 認証ロジック
}
```

**変更後**:
```typescript
// Server Component
import AuthWrapper from '@/components/AuthWrapper';
export default function Home() {
  return <AuthWrapper />;
}
```

**理由**: ページコンポーネントをServer Component化することで、初期HTMLの最適化とメタデータ生成の改善

---

#### `/Users/yuki.takagi/Desktop/noroi/frontend/src/components/CurseButton.tsx`
**変更内容**: `type` prop を追加

**変更箇所**:
```typescript
interface CurseButtonProps {
  // ...
  type?: 'button' | 'submit' | 'reset'; // 追加
}

export default function CurseButton({
  // ...
  type = 'button', // 追加
}: CurseButtonProps) {
  return (
    <motion.button
      type={type} // 追加
      // ...
    >
```

**理由**: LoginForm、RegisterFormでのsubmit動作を正しくサポート

---

### 2. 新規作成ファイル

#### `/Users/yuki.takagi/Desktop/noroi/frontend/src/components/AuthWrapper.tsx`
**役割**: 認証フロー管理のClient Component

**内容**:
- `'use client'` ディレクティブ
- localStorage による認証状態管理
- SplashScreen → Login/Register → Timeline の遷移ロジック
- useState、useEffect を使用

**理由**: page.tsx から Client-side ロジックを分離し、Server Component化を実現

---

#### `/Users/yuki.takagi/Desktop/noroi/frontend/src/types/index.ts`
**役割**: 共通型定義ファイル

**内容**:
```typescript
export interface CursePost { ... }
export interface RankingUser { ... }
export interface UserProfile { ... }
export interface UserPost { ... }
export interface RitualResult { ... }
export interface RecentAttack { ... }
```

**理由**:
- 型の一貫性を保証
- インポートパスの簡素化
- 将来的な型変更の一元管理

---

#### `/Users/yuki.takagi/Desktop/noroi/frontend/src/lib/data.ts`
**役割**: Server-side データフェッチング関数群

**内容**:
```typescript
export async function getTimelinePosts(): Promise<CursePost[]> { ... }
export async function getRankings(): Promise<RankingUser[]> { ... }
export async function getUserProfile(): Promise<UserProfile> { ... }
export async function getUserPosts(): Promise<UserPost[]> { ... }
```

**現状**: モックデータを返す
**将来**: 実際のAPI呼び出しに置き換え可能

**理由**:
- データ層とUI層の分離
- Server Componentでのデータフェッチング準備
- テストの容易化

---

#### `/Users/yuki.takagi/Desktop/noroi/frontend/src/components/ranking/RankingList.tsx`
**役割**: ランキング表示用Server Component (準備)

**内容**: Ranking表示ロジックを分離（アニメーションなし）

**理由**: 将来的にServer Componentとして活用可能にするための準備

---

#### `/Users/yuki.takagi/Desktop/noroi/frontend/src/components/profile/ProfileContent.tsx`
**役割**: プロフィール表示用コンポーネント (準備)

**内容**: 純粋な表示ロジック（アニメーションなし）

**理由**: Server Component化の準備

---

#### `/Users/yuki.takagi/Desktop/noroi/frontend/src/components/profile/ProfileClient.tsx`
**役割**: プロフィールのClient Component部分

**内容**:
- Framer Motion アニメーション
- Settings ボタンのイベントハンドリング
- ProfileContent の呼び出し

**理由**: Client-side機能を最小化しつつ、アニメーションを維持

---

### 3. ドキュメントファイル

#### `/Users/yuki.takagi/Desktop/noroi/frontend/OPTIMIZATION_REPORT.md`
**内容**:
- 最適化の詳細レポート
- Before/After の比較
- パフォーマンス改善のポイント
- 今後の最適化案

#### `/Users/yuki.takagi/Desktop/noroi/frontend/CHANGES_SUMMARY.md` (このファイル)
**内容**: 変更内容の簡潔なサマリー

---

## パフォーマンス改善の効果

### ビルド結果
```
✓ Compiled successfully in 1164.4ms
✓ Generating static pages (4/4) in 236.0ms

Route (app)
┌ ○ /              (Static)  ← 静的生成に成功!
└ ○ /_not-found    (Static)
```

### 改善ポイント

1. **page.tsx が Server Component に**
   - 初期HTMLに含まれるJavaScriptが削減
   - メタデータ生成の最適化
   - 静的生成(Static)が可能に

2. **データフェッチング層の整備**
   - `/src/lib/data.ts` で一元管理
   - Server Components での利用準備完了
   - API統合が容易

3. **型安全性の向上**
   - `/src/types/index.ts` で共通型定義
   - インポートの簡素化
   - リファクタリングの安全性向上

---

## 現状の制約と将来の改善案

### 制約
- **Framer Motion**: 多くのコンポーネントで使用されており、Client Component必須
- **localStorage**: 認証状態管理に使用、Client Component必須

### 改善案
1. **Framer Motion の段階的削除**
   - CSS Animations/Transitions への移行
   - View Transitions API の活用

2. **認証システムの改善**
   - Server-side Session への移行
   - Next.js Middleware での認証チェック
   - HTTP-only Cookie によるトークン管理

3. **さらなるコンポーネント分離**
   - Timeline、Ranking などを段階的に分離
   - Server Component 部分の拡大

---

## 開発者向けガイドライン

### 新しいコンポーネントを作成する際

1. **デフォルトは Server Component**
   - `'use client'` は必要な場合のみ追加

2. **Client Component が必要な場合**
   - useState、useEffect を使用
   - イベントハンドラ (onClick, onChange) を使用
   - ブラウザAPI (localStorage, window) を使用
   - Framer Motion を使用

3. **データフェッチング**
   - `/src/lib/data.ts` に関数を追加
   - Server Component で呼び出し
   - Client Component には props で渡す

4. **型定義**
   - `/src/types/index.ts` に追加
   - 一貫性を保つ

---

## まとめ

今回の最適化により、Next.js 16 App Router の機能を最大限活用できる基盤が整いました。

**主な成果**:
✅ page.tsx を Server Component に変換
✅ 静的生成 (Static) に成功
✅ データフェッチング層を整備
✅ 型定義を一元化
✅ ビルドエラーなし

**次のステップ**:
- データフェッチングの実装
- さらなるServer Component化
- Streaming SSRの活用
- Partial Prerendering (PPR) の検討

詳細は `OPTIMIZATION_REPORT.md` を参照してください。
