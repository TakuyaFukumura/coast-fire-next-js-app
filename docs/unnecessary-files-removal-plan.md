# 不要ファイル削除計画書

## 目的

このドキュメントは、リポジトリ内の不要なファイルや記述を特定し、削除の検討を行うための資料です。

## 作成日

2026-02-15

## 分析結果

### 1. 不要なSVGファイル（public/ディレクトリ）

以下のSVGファイルは、アプリケーション内で一切使用されていないことが確認されました：

#### 削除対象ファイル

- `public/file.svg` - Next.jsのデフォルトテンプレートファイル
- `public/globe.svg` - Next.jsのデフォルトテンプレートファイル
- `public/next.svg` - Next.jsのデフォルトテンプレートファイル
- `public/vercel.svg` - Next.jsのデフォルトテンプレートファイル
- `public/window.svg` - Next.jsのデフォルトテンプレートファイル

#### 確認方法

```bash
grep -r "file.svg\|globe.svg\|next.svg\|vercel.svg\|window.svg" src/ --include="*.tsx" --include="*.ts"
```

上記コマンドの実行結果、該当ファイルへの参照は一切見つかりませんでした。

#### 削除の影響

これらのファイルは、Next.jsプロジェクトの初期生成時に自動的に作成されるサンプルファイルです。現在のアプリケーションでは使用されておらず、削除してもアプリケーションの動作に影響はありません。

### 2. 古い説明文の修正（src/app/layout.tsx）

#### 現状の問題

`src/app/layout.tsx` の9行目に以下の記述があります：

```typescript
description: "SQLiteからメッセージを取得するシンプルなNext.jsアプリケーション",
```

#### 問題点

- このアプリケーションは現在、SQLite機能を使用していません
- CHANGELOG.mdの記録によると、v0.3.0でSQLiteデータベース関連機能は既に削除されています
- 現在の主要機能は「Coast FIRE 計算機」です

#### 推奨される修正

```typescript
description: "Coast FIREの目標達成に必要な資産額を計算するNext.jsアプリケーション",
```

または、より簡潔に：

```typescript
description: "Coast FIRE計算機 - 老後の目標資産額達成に必要な現在資産額を算出",
```

### 3. メタデータタイトルの更新検討（src/app/layout.tsx）

#### 現状

```typescript
title: "基本Next.jsアプリ",
```

#### 検討事項

現在のタイトル「基本Next.jsアプリ」は、アプリケーションの具体的な機能を反映していません。

#### 推奨される修正

```typescript
title: "Coast FIRE計算機",
```

または、より詳細に：

```typescript
title: "Coast FIRE計算機 - 老後資産シミュレーター",
```

## ファイル末尾の改行チェック

すべてのソースファイル（.tsx、.ts、.json、.md、.css、.mjs）について末尾の改行を確認しました。

### チェック結果

Python スクリプトを使用して確認した結果、**すべてのファイルが適切に末尾改行を持っている**ことが確認されました。

## 削除の優先度と推奨アクション

### 優先度：高

1. **公開ディレクトリの未使用SVGファイル削除**
   - 理由：完全に使用されておらず、リポジトリサイズの削減に貢献
   - リスク：なし
   - 推奨：即座に削除

2. **layout.tsxのdescriptionメタデータ修正**
   - 理由：現在の機能と説明が一致していない
   - リスク：なし（メタデータの更新のみ）
   - 推奨：即座に修正

### 優先度：中

3. **layout.tsxのtitleメタデータ修正**
   - 理由：より明確なタイトルに変更することでSEOとユーザビリティが向上
   - リスク：なし
   - 推奨：検討の上で修正

## 実装手順

### ステップ1: SVGファイルの削除

```bash
rm public/file.svg
rm public/globe.svg
rm public/next.svg
rm public/vercel.svg
rm public/window.svg
```

### ステップ2: layout.tsxのメタデータ修正

ファイル：`src/app/layout.tsx`

修正前：
```typescript
export const metadata: Metadata = {
    title: "基本Next.jsアプリ",
    description: "SQLiteからメッセージを取得するシンプルなNext.jsアプリケーション",
};
```

修正後：
```typescript
export const metadata: Metadata = {
    title: "Coast FIRE計算機",
    description: "Coast FIRE計算機 - 老後の目標資産額達成に必要な現在資産額を算出",
};
```

### ステップ3: 動作確認

```bash
npm run build
npm run lint
npm test
```

すべてのチェックが正常に完了することを確認します。

## その他の観察事項

### 良好な点

1. **コードの品質**
   - すべてのファイルが適切に末尾改行を持っている
   - TypeScriptによる型安全性が確保されている
   - ESLintとJestによるコード品質管理が設定されている

2. **プロジェクト構成**
   - 明確なディレクトリ構造
   - 適切なコンポーネント分割
   - テストが整備されている

3. **ドキュメント**
   - README.mdが詳細で最新の情報を含んでいる
   - CHANGELOG.mdで変更履歴が適切に管理されている

### 追加の削除候補なし

詳細な調査の結果、上記以外に削除すべき不要なファイルや記述は見つかりませんでした。

## まとめ

本リポジトリは全体的によく整理されており、主な問題点は以下の2つです：

1. **未使用のSVGファイル（5個）** - Next.js初期テンプレートの残存ファイル
2. **古いメタデータ記述** - 過去の機能（SQLite）への参照

これらを修正することで、リポジトリはさらにクリーンになり、メンテナンス性が向上します。

## 参考情報

- CHANGELOG.md v0.3.0: SQLiteデータベース関連機能の削除記録
- README.md: 現在の主要機能としてCoast FIRE計算機の説明
- src/app/page.tsx: `/coast-fire`へのリダイレクト実装
