# ホーム画面削除検討ドキュメント

## 1. 概要

本ドキュメントでは、coast-fire-next-js-appのホーム画面（`/`）を削除する際の検討事項、影響範囲、および実装手順について記載します。

## 2. 現状分析

### 2.1 現在のホーム画面の概要

- **ファイルパス**: `src/app/page.tsx`
- **URL**: `/`（ルートパス）
- **主な機能**:
  - SQLiteデータベースから取得したメッセージを表示
  - ローディング状態の表示
  - エラーハンドリング
  - ダークモード対応
- **使用しているAPI**: `/api/message`
- **依存コンポーネント**: なし（独立したページコンポーネント）

### 2.2 現在のページ構成

```
src/app/
├── page.tsx           # ホーム画面（削除対象）
└── coast-fire/
    └── page.tsx       # Coast FIRE計算機ページ（メイン機能）
```

### 2.3 現在のナビゲーション構造

`Header.tsx` のナビゲーションリンク：
- ホーム（`/`）
- Coast FIRE 計算機（`/coast-fire`）

## 3. 削除の理由

- アプリケーションの主要機能はCoast FIRE計算機であり、ホーム画面は本質的な機能を提供していない
- SQLiteデータベースからメッセージを表示するだけのシンプルな画面で、実用的な価値が低い
- アプリケーションのメイン機能に直接アクセスできるようにすることで、ユーザー体験を向上させる

## 4. 影響範囲の分析

### 4.1 影響を受けるファイル

1. **削除が必要なファイル**:
   - `src/app/page.tsx` - ホーム画面コンポーネント

2. **修正が必要なファイル**:
   - `src/app/components/Header.tsx` - ナビゲーションリンクから「ホーム」を削除
   - `src/app/layout.tsx` - メタデータの更新（オプション）
   - `README.md` - プロジェクト構造の説明を更新

3. **影響を受ける可能性のあるファイル**:
   - `src/app/api/message/route.ts` - このAPIエンドポイントが他で使用されていない場合は削除を検討
   - `lib/database.ts` - データベースの初期化でメッセージテーブルを作成している場合、必要性を検討

4. **テストファイル**:
   - `__tests__/` 配下にホーム画面のテストがある場合は削除
   - APIエンドポイントのテストがある場合は削除を検討

### 4.2 依存関係の確認

- **データベースAPIの依存**: ホーム画面のみが `/api/message` を使用している
- **コンポーネントの依存**: ホーム画面は他のコンポーネントから参照されていない
- **ルーティングの依存**: ホーム画面は独立しており、他のページへの影響は最小限

## 5. 削除後のルーティング設計

### 5.1 ルートパスのリダイレクト

ホーム画面削除後、ルートパス（`/`）にアクセスした際の動作を決定する必要があります。

**推奨オプション**: ルートパス（`/`）を Coast FIRE 計算機ページにリダイレクト

実装方法は以下の2つから選択：

#### オプション A: 新しい page.tsx でリダイレクト

`src/app/page.tsx` を以下の内容で置き換える：

```typescript
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/coast-fire');
}
```

#### オプション B: middleware でリダイレクト

`middleware.ts` を作成してリダイレクトを設定：

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/coast-fire', request.url));
  }
}

export const config = {
  matcher: '/',
};
```

**推奨**: オプションAの方がシンプルで、Next.jsのApp Routerの慣例に沿っています。

### 5.2 削除後のナビゲーション構造

ヘッダーのナビゲーションリンクを以下のように変更：

```typescript
const navLinks = [
  { href: '/coast-fire', label: 'Coast FIRE 計算機' },
  // 必要に応じて他のページへのリンクを追加
];
```

ロゴのリンク先も `/coast-fire` に変更する必要があるかを検討：

```typescript
<Link href="/coast-fire" className="text-xl font-semibold...">
  coast-fire-next-js-app
</Link>
```

## 6. 実装手順

### 6.1 Phase 1: 準備と調査

1. **テストの実行**: 現在のテストスイートを実行し、既存の動作を確認
   ```bash
   npm test
   ```

2. **APIエンドポイントの使用状況を確認**: `/api/message` が他の場所で使用されていないか確認
   ```bash
   grep -r "/api/message" src/
   ```

3. **データベースの依存関係を確認**: `lib/database.ts` でメッセージテーブルの使用状況を確認

### 6.2 Phase 2: コード変更

1. **ホーム画面のリダイレクト実装**
   - `src/app/page.tsx` を置き換えてリダイレクトを実装

2. **ヘッダーコンポーネントの更新**
   - `src/app/components/Header.tsx` のナビゲーションリンクを更新
   - ロゴのリンク先を更新（必要に応じて）

3. **メタデータの更新**
   - `src/app/layout.tsx` のメタデータを更新（オプション）

4. **README.md の更新**
   - プロジェクト構造の説明を更新
   - 不要な説明を削除

5. **APIエンドポイントの削除（オプション）**
   - `/api/message` が不要な場合は削除
   - `src/app/api/message/route.ts` を削除
   - 関連するテストを削除

6. **データベース関連コードの整理（オプション）**
   - `lib/database.ts` からメッセージテーブル関連のコードを削除（他で使用されていない場合）

### 6.3 Phase 3: テストと検証

1. **ビルドの確認**
   ```bash
   npm run build
   ```

2. **開発サーバーでの動作確認**
   ```bash
   npm run dev
   ```
   - `/` にアクセスして `/coast-fire` にリダイレクトされることを確認
   - `/coast-fire` に直接アクセスして正常に動作することを確認
   - ヘッダーのナビゲーションが正しく表示されることを確認

3. **リンティング**
   ```bash
   npm run lint
   ```

4. **テストの実行**
   ```bash
   npm test
   ```

5. **ダークモードの動作確認**
   - ダークモード/ライトモードの切り替えが正常に動作することを確認

### 6.4 Phase 4: ドキュメントの更新

1. **CHANGELOGの更新**
   - `CHANGELOG.md` にホーム画面削除の変更を記録

2. **READMEの更新確認**
   - プロジェクト構造の説明が最新であることを確認

## 7. リスクと注意事項

### 7.1 潜在的なリスク

1. **外部リンク**: 外部サイトやドキュメントからルートパス（`/`）への直接リンクがある場合、リダイレクトが必要
2. **ブックマーク**: ユーザーがルートパスをブックマークしている可能性があるが、リダイレクトで対応可能
3. **SEO**: ルートパスのSEOへの影響は最小限（リダイレクトで対応可能）

### 7.2 注意事項

1. **段階的な削除**: まずリダイレクトを実装し、動作確認後に関連コード（API、データベース）を削除する
2. **後方互換性**: リダイレクトを実装することで、既存のリンクやブックマークの互換性を維持
3. **テストの重要性**: 各フェーズでテストを実行し、予期しない動作がないことを確認

## 8. ロールバック計画

削除後に問題が発生した場合のロールバック手順：

1. **Gitでの復元**:
   ```bash
   git revert <commit-hash>
   ```

2. **必要なファイルの復元**:
   - `src/app/page.tsx` の元のコードを復元
   - `src/app/components/Header.tsx` の変更を元に戻す

3. **動作確認**:
   ```bash
   npm run build
   npm run dev
   ```

## 9. まとめ

ホーム画面の削除は、以下の理由から推奨される変更です：

- アプリケーションの主要機能（Coast FIRE計算機）への直接アクセスを可能にする
- 不要な画面を削除することでコードベースをシンプルに保つ
- ユーザー体験の向上（余分なクリックを減らす）

実装は段階的に行い、各フェーズでテストを実行することで、安全に変更を適用できます。リダイレクトを実装することで、後方互換性も維持されます。

## 10. 参考情報

- [Next.js App Router - Redirecting](https://nextjs.org/docs/app/building-your-application/routing/redirecting) - セクション5.1のリダイレクト実装（オプションA）に関連
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) - セクション5.1のリダイレクト実装（オプションB）に関連
