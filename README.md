# coast-fire-next-js-app

Next.jsを使ったシンプルなアプリケーションです。

## 技術スタック

- **Next.js 16.1.6** - React フレームワーク（App Routerを使用）
- **React 19.2.4** - ユーザーインターフェース構築
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **Recharts** - データ可視化（チャート表示）
- **ESLint** - コード品質管理

## 始め方

### 前提条件

- Node.js 20.x以上
- npm、yarn、またはpnpm

### インストール

1. リポジトリをクローン：
    ```bash
    git clone https://github.com/TakuyaFukumura/coast-fire-next-js-app.git
    ```
    ```bash
    cd coast-fire-next-js-app
    ```

2. 依存関係をインストール：
    ```bash
    npm install
    ```
   または
    ```bash
    yarn install
    ```
   または
    ```bash
    pnpm install
    ```

### 開発サーバーの起動

```bash
npm run dev
```

または

```bash
yarn dev
```

または

```bash
pnpm dev
```

## 機能

### Coast FIRE 計算機

このアプリケーションのメイン機能で、老後の目標資産額を達成するために現時点で必要な資産額を計算します。

**主な機能:**
- インタラクティブな入力フォーム（スライダーと数値入力）
- 計算結果の視覚的な表示
- 資産推移グラフ（Recharts使用）
- 詳細データテーブル（ソート・ページネーション機能付き）
- ダークモード対応

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて
アプリケーションを確認してください。自動的にCoast FIRE計算機ページにリダイレクトされます。

### ビルドと本番デプロイ

本番用にアプリケーションをビルドする：

```bash
npm run build
```

```bash
npm start
```

または

```bash
yarn build
```

```bash
yarn start
```

または

```bash
pnpm build
```

```bash
pnpm start
```

## プロジェクト構造

```
├── lib/
│   └── coastFireCalculations.ts  # Coast FIRE計算ロジック
├── src/
│   └── app/
│       ├── coast-fire/
│       │   └── page.tsx  # Coast FIRE計算機ページ
│       ├── components/      # Reactコンポーネント
│       │   ├── DarkModeProvider.tsx  # ダークモードProvider
│       │   └── Header.tsx   # ヘッダーコンポーネント
│       ├── globals.css      # グローバルスタイル
│       ├── layout.tsx       # アプリケーションレイアウト
│       └── page.tsx         # ホームページ（Coast FIREへリダイレクト）
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 機能

### テスト

このプロジェクトはJestを使用したテストが設定されています。

#### テストの実行

```bash
npm test
```

または

```bash
yarn test
```

または

```bash
pnpm test
```

#### テストの監視モード

```bash
npm run test:watch
```

#### カバレッジレポートの生成

```bash
npm run test:coverage
```

#### テストファイルの構成

- `__tests__/lib/coastFireCalculations.test.ts`: Coast FIRE計算ロジックのテスト
- `__tests__/src/app/components/DarkModeProvider.test.tsx`: ダークモードProvider のテスト
- `__tests__/src/app/components/Header.test.tsx`: ヘッダーコンポーネントのテスト

#### テストの特徴

- **計算ロジックテスト**: Coast FIRE計算の正確性を検証（テストカバレッジ100%）
- **Reactコンポーネントテスト**: React Testing Library を使用したコンポーネントのレンダリングとインタラクションのテスト
- **モッキング**: localStorage や外部依存関係のモック
- **カバレッジ**: コードカバレッジの測定と報告

### リンティング

```bash
npm run lint
```

または

```bash
yarn lint
```

または

```bash
pnpm lint
```

### 型チェック

TypeScriptの型チェックは、ビルド時またはIDEで自動的に実行されます。

## CI/CD

このプロジェクトはGitHub Actionsを使用した継続的インテグレーション（CI）を設定しています。

### 自動テスト

以下の条件でCIが実行されます：

- `main`ブランチへのプッシュ時
- プルリクエストの作成・更新時

CIでは以下のチェックが行われます：

- ESLintによる静的解析
- TypeScriptの型チェック
- Jestを使用したユニットテストとインテグレーションテスト
- アプリケーションのビルド検証
- Node.js 20.x での動作確認

## 自動依存関係更新（Dependabot）

このプロジェクトでは、依存関係の安全性と最新化のために[Dependabot](https://docs.github.com/ja/code-security/dependabot)
を利用しています。

- GitHub Actionsおよびnpmパッケージの依存関係は**月次（月曜日 09:00 JST）**で自動チェック・更新されます。
- 更新内容は自動でプルリクエストとして作成されます。
- 詳細な設定は `.github/dependabot.yml` を参照してください。

## トラブルシューティング

### ポート競合

デフォルトのポート3000が使用中の場合：

```bash
npm run dev -- --port 3001
```

