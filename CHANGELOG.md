# 変更履歴

このファイルは、このプロジェクトの重要な変更をすべて記録します。

このフォーマットは[Keep a Changelog](https://keepachangelog.com/ja/1.0.0/)に基づいており、
このプロジェクトは[セマンティック バージョニング](https://semver.org/lang/ja/)に準拠しています。

## [Unreleased]

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

[unreleased]: https://github.com/TakuyaFukumura/coast-fire-next-js-app/compare/v0.2.0...HEAD

[0.2.0]: https://github.com/TakuyaFukumura/coast-fire-next-js-app/compare/v0.1.0...v0.2.0

[0.1.0]: https://github.com/TakuyaFukumura/coast-fire-next-js-app/compare/v0.1.0^...v0.1.0

