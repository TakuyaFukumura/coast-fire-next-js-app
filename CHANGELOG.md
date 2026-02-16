# 変更履歴

このファイルは、このプロジェクトの重要な変更をすべて記録します。

このフォーマットは[Keep a Changelog](https://keepachangelog.com/ja/1.0.0/)に基づいており、
このプロジェクトは[セマンティック バージョニング](https://semver.org/lang/ja/)に準拠しています。

## [Unreleased]

## [0.5.0] - 2026-02-16

### 変更

- 導線整理: ルートパス (`/`) でCoast FIRE計算機を直接表示するように変更
    - `src/app/page.tsx` をリダイレクトからCoast FIRE計算機の直接表示に変更
    - `/coast-fire` ディレクトリを削除
    - `/coast-fire` から `/` への永続的なリダイレクト（301）を `next.config.ts` に追加
- ヘッダーコンポーネントの簡素化
    - ナビゲーションメニューを削除（アプリケーションは単一ページのため不要）
    - モバイルメニュー関連のコードを削除
    - アプリケーション名とダークモード切り替えボタンのみを保持
- README.md の更新
    - プロジェクト構造を最新の実装に合わせて更新
    - リダイレクトに関する記述を削除
- テストの更新
    - `Header.test.tsx` からナビゲーション関連のテストを削除
    - 簡素化されたヘッダーの機能に合わせてテストを更新

### 削除

- `src/app/coast-fire/` ディレクトリ全体
- 実装後不要になった設計ドキュメント（`docs/navigation-improvement-design.md`）

## [0.4.0] - 2026-02-16

### 変更

- README.mdの更新
    - プロジェクト構造セクションを現在の実装に合わせて更新（全コンポーネントとテストファイルを反映）
    - Turbopack使用についての説明を追加
- メタデータの更新
    - アプリケーションタイトルを「基本Next.jsアプリ」から「Coast FIRE計算機」に変更
    - アプリケーション説明を現在の機能（Coast FIRE計算機）に合わせて更新
- 入力パラメータの範囲設定

### 削除

- 未使用の SVG ファイルを削除（Next.js初期テンプレートの残存ファイル）
    - `public/file.svg`
    - `public/globe.svg`
    - `public/next.svg`
    - `public/vercel.svg`
    - `public/window.svg`
- 実装後不要になった検討ドキュメント（`docs/unnecessary-files-removal-plan.md`）

## [0.3.0] - 2026-02-15

### 削除

- ホーム画面を削除し、ルートパスから Coast FIRE 計算機ページへのリダイレクトを実装
- SQLite データベース関連機能の削除
    - `lib/database.ts`
    - `src/app/api/message/route.ts`
    - データベース関連の依存関係（`better-sqlite3`, `@types/better-sqlite3`）
- ヘッダーのナビゲーションから「ホーム」リンクを削除
- 実装後不要になった検討ドキュメント（`docs/home-screen-removal-consideration.md`）

### 変更

- ヘッダーのロゴリンク先を `/` から `/coast-fire` に変更
- アプリケーションのメイン機能である Coast FIRE 計算機に直接アクセス可能に

## [0.2.0] - 2026-02-14

### 追加

- Coast FIRE 計算機能を実装
    - 老後の目標資産額を達成するために現時点で必要な資産額を計算
    - インタラクティブな入力フォーム（スライダーと数値入力）
    - 計算結果の視覚的な表示
    - 資産推移グラフ（Recharts使用）
    - 詳細データテーブル（ソート・ページネーション機能付き）
    - Coast FIRE 専用ページ (`/coast-fire`)
- 計算ロジック部分の単体テスト（該当ロジックはテストカバレッジ100%）
- Recharts グラフライブラリ（v3.7.0）の追加

### 削除

- 実装後不要になった仕様書ドキュメント (`docs/coast-fire-app-specification.md`)

## [0.1.0] - 2026-02-14

### 追加

- 雛形アプリの初期設定

[unreleased]: https://github.com/TakuyaFukumura/coast-fire-next-js-app/compare/v0.5.0...HEAD

[0.5.0]: https://github.com/TakuyaFukumura/coast-fire-next-js-app/compare/v0.4.0...v0.5.0

[0.4.0]: https://github.com/TakuyaFukumura/coast-fire-next-js-app/compare/v0.3.0...v0.4.0

[0.2.0]: https://github.com/TakuyaFukumura/coast-fire-next-js-app/compare/v0.2.0...v0.3.0

[0.2.0]: https://github.com/TakuyaFukumura/coast-fire-next-js-app/compare/v0.1.0...v0.2.0

[0.1.0]: https://github.com/TakuyaFukumura/coast-fire-next-js-app/compare/v0.1.0^...v0.1.0

