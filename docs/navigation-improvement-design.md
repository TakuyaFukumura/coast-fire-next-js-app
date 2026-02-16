# 導線整理設計書

## 概要

このドキュメントは、TOPページのリダイレクトを廃止し、最初から「Coast FIRE 計算機」画面を直接開くようにするための設計について説明します。

## 現状の問題点

### 1. 不要なリダイレクト
- 現在、ルートパス (`/`) にアクセスすると `/coast-fire` へ自動的にリダイレクトされる
- `src/app/page.tsx` は単にリダイレクト処理のみを行っており、コンテンツを持たない
- ユーザーエクスペリエンスの観点から、不要なリダイレクトはページ表示の遅延を引き起こす可能性がある

### 2. ヘッダーメニューの冗長性
- 現在のヘッダー (`src/app/components/Header.tsx`) にはナビゲーションリンクがある
- しかし、アプリケーションには実質的に1つのページ（Coast FIRE計算機）しか存在しない
- ナビゲーションリンクは `/coast-fire` へのリンク1つのみで、機能的な意味が薄い

### 3. URL構造の複雑性
- ユーザーが直接アクセスする際、`/coast-fire` という URL を覚える必要がある
- ルートパス (`/`) でアプリケーションのメイン機能にアクセスできる方がシンプルで分かりやすい

## 提案する改善案

### 1. ルートパスでCoast FIRE計算機を直接表示

**変更内容:**
- `src/app/page.tsx` を削除し、代わりにCoast FIRE計算機のコンポーネントを直接配置
- リダイレクト処理を削除し、ルートパス (`/`) で直接計算機を表示

**メリット:**
- リダイレクトによる遅延が解消される
- URLがシンプルになる（`/` だけで済む）
- SEO的にも、リダイレクトよりも直接コンテンツを提供する方が望ましい

### 2. ヘッダーからナビゲーションメニューを削除

**変更内容:**
- ヘッダーコンポーネントからナビゲーションリンク部分を削除
- アプリケーション名（ロゴ）とダークモード切り替えボタンのみを残す
- モバイルメニューも不要になるため削除

**メリット:**
- UIがシンプルになり、ユーザーの認知負荷が減る
- 不要な機能を削除することで、コードの保守性が向上する
- ヘッダーの高さも抑えられ、メインコンテンツに集中できる

### 3. `/coast-fire` パスの取り扱い

**変更内容:**
- `/coast-fire` ディレクトリを削除
- 既存の `/coast-fire` へのリンクやブックマークのために、リダイレクト設定を追加（オプション）

**選択肢:**
- **案A**: `/coast-fire` パスを完全に削除し、ルートパスのみにする
- **案B**: `/coast-fire` から `/` へのリダイレクトを設定し、既存リンクの互換性を保つ

**推奨**: 案Bを採用し、`next.config.ts` にリダイレクト設定を追加する

## 実装計画

### Phase 1: ページ構造の変更

#### 1.1 ルートページの書き換え
**対象ファイル:** `src/app/page.tsx`

**変更内容:**
```tsx
// 変更前: リダイレクトのみ
import {redirect} from 'next/navigation';

export default function Home() {
    redirect('/coast-fire');
}

// 変更後: Coast FIRE計算機を直接表示
import CoastFireCalculator from './components/CoastFireCalculator';

export const metadata = {
    title: 'Coast FIRE 計算機 | Coast FIRE Next.js App',
    description: '老後の目標資産額を達成するために現時点で必要な資産額を計算するCoast FIRE計算機',
};

export default function Home() {
    return <CoastFireCalculator/>;
}
```

#### 1.2 `/coast-fire` ディレクトリの削除
**対象:** `src/app/coast-fire/` ディレクトリ全体

このディレクトリは不要になるため削除します。

#### 1.3 リダイレクト設定の追加（互換性のため）
**対象ファイル:** `next.config.ts`

既存の `/coast-fire` へのリンクやブックマークのために、リダイレクトを設定します:

```typescript
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/coast-fire',
                destination: '/',
                permanent: true, // 301リダイレクト
            },
        ];
    },
};
```

### Phase 2: ヘッダーの簡素化

#### 2.1 ヘッダーコンポーネントの修正
**対象ファイル:** `src/app/components/Header.tsx`

**削除する要素:**
- ナビゲーションリンク（`navLinks` 配列）
- デスクトップナビゲーション部分
- モバイルメニュー関連のコード
  - `mobileMenuOpen` ステート
  - モバイルメニューボタン
  - モバイルメニュー本体
- `usePathname` フックと `isActive` 関数（不要になるため）

**残す要素:**
- アプリケーション名/ロゴ
- ダークモード切り替えボタン

**変更後のイメージ:**
```tsx
'use client';

import {useDarkMode} from './DarkModeProvider';

export default function Header() {
    const {theme, setTheme} = useDarkMode();

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const getThemeIcon = () => theme === 'light' ? '☀️' : '🌙';
    const getThemeLabel = () => theme === 'light' ? 'ライトモード' : 'ダークモード';

    return (
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b
            border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Coast FIRE 計算機
                    </div>

                    <button
                        onClick={handleThemeToggle}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium
                        text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                        rounded-lg transition-colors duration-200"
                        title={`現在: ${getThemeLabel()}`}
                    >
                        <span className="text-lg">{getThemeIcon()}</span>
                        <span className="hidden sm:inline">{getThemeLabel()}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
```

### Phase 3: テストとドキュメントの更新

#### 3.1 テストの更新
**対象ファイル:** `__tests__/src/app/components/Header.test.tsx`

ヘッダーコンポーネントのテストを更新し、ナビゲーション関連のテストケースを削除します。

#### 3.2 READMEの更新
**対象ファイル:** `README.md`

- URL参照を `http://localhost:3000/coast-fire` から `http://localhost:3000` に変更
- 「自動的にCoast FIRE計算機ページにリダイレクトされます」という記述を削除
- プロジェクト構造の説明を更新

## 影響範囲の分析

### 変更が必要なファイル

1. **`src/app/page.tsx`** - Coast FIRE計算機を直接表示するように変更
2. **`src/app/coast-fire/page.tsx`** - 削除
3. **`src/app/components/Header.tsx`** - ナビゲーションメニューを削除
4. **`next.config.ts`** - リダイレクト設定を追加
5. **`README.md`** - ドキュメント更新
6. **`__tests__/src/app/components/Header.test.tsx`** - テスト更新

### 影響を受けないファイル

- `src/app/components/CoastFireCalculator.tsx` - 変更なし
- `src/app/components/InputForm.tsx` - 変更なし
- `src/app/components/ResultDisplay.tsx` - 変更なし
- `src/app/components/AssetChart.tsx` - 変更なし
- `src/app/components/AssetTable.tsx` - 変更なし
- `src/app/components/DarkModeProvider.tsx` - 変更なし
- `src/app/layout.tsx` - 変更なし
- `lib/coastFireCalculations.ts` - 変更なし

### 外部への影響

- **既存のブックマーク**: `/coast-fire` へのブックマークは、リダイレクト設定により `/` へ自動転送される
- **検索エンジン**: 301リダイレクトにより、SEO的な価値は新しいURLに引き継がれる
- **外部リンク**: 既存の `/coast-fire` へのリンクも引き続き機能する

## リスクと対策

### リスク1: 既存ユーザーの混乱
**対策:**
- `/coast-fire` から `/` へのリダイレクトを設定し、既存のブックマークやリンクが機能し続けるようにする
- CHANGELOGに変更を明記する

### リスク2: テストの失敗
**対策:**
- 変更後、全テストスイートを実行し、問題がないことを確認する
- 特にヘッダーコンポーネントのテストは大幅に変更されるため、慎重に更新する

### リスク3: ビルドエラー
**対策:**
- 変更後、`npm run build` を実行し、ビルドが成功することを確認する
- Next.jsのリダイレクト設定が正しく動作することを確認する

## 実装後の確認事項

### 機能確認
- [ ] ルートパス (`/`) でCoast FIRE計算機が表示されること
- [ ] `/coast-fire` にアクセスすると `/` へリダイレクトされること
- [ ] ヘッダーにナビゲーションメニューが表示されないこと
- [ ] ダークモード切り替えが正常に動作すること
- [ ] Coast FIRE計算機の全機能が正常に動作すること

### 技術確認
- [ ] すべてのテストが成功すること
- [ ] ビルドが成功すること
- [ ] リンターが警告やエラーを出さないこと
- [ ] TypeScriptの型チェックが通ること

## まとめ

この改善により、以下の効果が期待できます：

1. **シンプルなURL構造**: ユーザーは `/` だけでアプリケーションにアクセスできる
2. **パフォーマンスの向上**: リダイレクトの削除により、初回読み込みが高速化される
3. **コードの簡素化**: 不要なナビゲーションコードを削除し、保守性が向上する
4. **UXの改善**: UIがシンプルになり、ユーザーはメインコンテンツに集中できる
5. **後方互換性**: リダイレクト設定により、既存のリンクやブックマークも機能する

これらの変更は、アプリケーションの目的（単一機能の計算機）に適した、よりシンプルで直感的な構造を実現します。
