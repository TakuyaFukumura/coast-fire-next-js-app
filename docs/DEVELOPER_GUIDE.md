# 開発者ガイド

## 目次

1. [概要](#概要)
2. [開発環境のセットアップ](#開発環境のセットアップ)
3. [プロジェクト構造](#プロジェクト構造)
4. [コーディング規約](#コーディング規約)
5. [テスト戦略](#テスト戦略)
6. [デバッグ方法](#デバッグ方法)
7. [開発ワークフロー](#開発ワークフロー)
8. [トラブルシューティング](#トラブルシューティング)

## 概要

Coast FIRE Next.js アプリケーションは、老後の資産形成計画をサポートするための計算ツールです。このドキュメントでは、開発者がプロジェクトに貢献するために必要な情報を提供します。

### Coast FIRE とは

Coast FIRE（Coast Financial Independence, Retire Early）は、現時点で必要な資産額を確保し、その後は追加投資をせず複利運用のみで老後資産を形成する戦略です。

### 技術スタック

- **フロントエンド**: Next.js 16（App Router）、React 19、TypeScript
- **スタイリング**: Tailwind CSS 4
- **データ可視化**: Recharts 3
- **テスト**: Jest 30、React Testing Library
- **コード品質**: ESLint 9
- **ビルドツール**: Turbopack（開発時）

## 開発環境のセットアップ

### 必要な環境

- **Node.js**: 20.x 以上
- **npm**: 10.x 以上（または yarn、pnpm）
- **Git**: 最新版推奨

### 初回セットアップ手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/TakuyaFukumura/coast-fire-next-js-app.git
cd coast-fire-next-js-app

# 2. 依存関係をインストール
npm install

# 3. 開発サーバーを起動
npm run dev

# 4. ブラウザで http://localhost:3000 を開く
```

### エディタの推奨設定

#### Visual Studio Code

推奨拡張機能：

- ESLint
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Prettier（オプション）

`.vscode/settings.json` の推奨設定：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## プロジェクト構造

```
coast-fire-next-js-app/
├── lib/                           # ビジネスロジック層
│   └── coastFireCalculations.ts  # Coast FIRE 計算エンジン
├── src/
│   ├── types/                     # TypeScript 型定義
│   │   └── coastFire.ts           # Coast FIRE 関連の型
│   └── app/                       # Next.js App Router
│       ├── layout.tsx             # ルートレイアウト
│       ├── page.tsx               # ホームページ（リダイレクト）
│       ├── globals.css            # グローバルスタイル
│       ├── coast-fire/
│       │   └── page.tsx           # Coast FIRE 計算機ページ
│       └── components/            # React コンポーネント
│           ├── CoastFireCalculator.tsx  # メインコンテナ
│           ├── InputForm.tsx            # 入力フォーム
│           ├── ResultDisplay.tsx        # 結果表示
│           ├── AssetChart.tsx           # 資産推移グラフ
│           ├── AssetTable.tsx           # データテーブル
│           ├── Header.tsx               # ヘッダー
│           └── DarkModeProvider.tsx     # ダークモード管理
├── __tests__/                     # テストファイル
│   ├── lib/
│   │   └── coastFireCalculations.test.ts
│   └── src/app/components/
│       ├── DarkModeProvider.test.tsx
│       └── Header.test.tsx
├── public/                        # 静的ファイル
├── docs/                          # ドキュメント
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD パイプライン
└── 設定ファイル
    ├── next.config.ts             # Next.js 設定
    ├── tsconfig.json              # TypeScript 設定
    ├── tailwind.config.ts         # Tailwind CSS 設定
    ├── jest.config.mjs            # Jest 設定
    └── eslint.config.mjs          # ESLint 設定
```

### ディレクトリの役割

#### `lib/`

ビジネスロジックを含むディレクトリ。フレームワークに依存しない純粋な計算ロジックを配置します。

- **特徴**: React/Next.js に依存しない
- **テスタビリティ**: 高い（単体テストが容易）
- **再利用性**: 高い

#### `src/app/`

Next.js の App Router を使用したページとレイアウトを配置します。

- **ルーティング**: ファイルシステムベース
- **Server Components**: デフォルトで使用
- **Client Components**: `'use client'` ディレクティブで明示

#### `src/app/components/`

React コンポーネントを配置します。コンポーネントは以下の原則に従います：

- **単一責任の原則**: 各コンポーネントは1つの責任を持つ
- **再利用性**: 可能な限り汎用的に設計
- **型安全性**: すべてのプロパティに TypeScript の型を定義

## コーディング規約

### TypeScript

#### 型定義

```typescript
// ✅ 良い例: 明示的な型定義
interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): User {
  // ...
}

// ❌ 悪い例: any 型の使用
function getUser(id: any): any {
  // ...
}
```

#### 型のエクスポート

```typescript
// ✅ 良い例: 型を別ファイルで定義してエクスポート
// types/coastFire.ts
export interface CoastFireInput {
  targetAmount: number;
  targetAge: number;
  // ...
}

// ❌ 悪い例: コンポーネント内で型を定義
```

### React コンポーネント

#### 関数コンポーネント

```typescript
// ✅ 良い例: アロー関数ではなく関数宣言を使用
export default function MyComponent({ title }: { title: string }) {
  return <div>{title}</div>;
}

// ❌ 悪い例: アロー関数
const MyComponent = ({ title }: { title: string }) => {
  return <div>{title}</div>;
};
export default MyComponent;
```

#### Props の型定義

```typescript
// ✅ 良い例: interface を使用
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ label, onClick, disabled = false }: ButtonProps) {
  // ...
}
```

#### State 管理

```typescript
// ✅ 良い例: 型を明示
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// ❌ 悪い例: 型推論に頼りすぎる（null が許容されない）
const [user, setUser] = useState(null); // 型は null のみ
```

### CSS / Tailwind CSS

#### クラス名の記述順序

1. レイアウト（flex、grid、position など）
2. サイズ（width、height など）
3. スペーシング（margin、padding）
4. タイポグラフィ
5. 色
6. その他

```tsx
// ✅ 良い例
<div className="flex items-center justify-between w-full p-4 text-lg font-bold text-gray-800 bg-white rounded-lg">
  {/* ... */}
</div>
```

#### レスポンシブデザイン

モバイルファーストのアプローチを使用：

```tsx
// ✅ 良い例: モバイルファースト
<div className="text-sm md:text-base lg:text-lg">
  {/* ... */}
</div>
```

### ファイル命名規則

- **コンポーネント**: PascalCase（例: `CoastFireCalculator.tsx`）
- **ユーティリティ関数**: camelCase（例: `coastFireCalculations.ts`）
- **型定義**: camelCase（例: `coastFire.ts`）
- **テストファイル**: 元のファイル名 + `.test.ts(x)`（例: `Header.test.tsx`）

## テスト戦略

### テストの種類

#### 1. 単体テスト（Unit Tests）

ビジネスロジックや純粋関数をテストします。

```typescript
// 例: lib/coastFireCalculations.test.ts
describe('calculateCoastFire', () => {
  it('should calculate required amount correctly', () => {
    const input: CoastFireInput = {
      targetAmount: 2000,
      targetAge: 65,
      currentAge: 28,
      returnRate: 0.05,
      inflationRate: 0.02,
    };
    
    const result = calculateCoastFire(input);
    
    expect(result.requiredAmount).toBeGreaterThan(0);
    expect(result.investmentYears).toBe(37);
  });
});
```

#### 2. コンポーネントテスト（Component Tests）

React コンポーネントの動作をテストします。

```typescript
// 例: __tests__/src/app/components/Header.test.tsx
describe('Header', () => {
  it('should render correctly', () => {
    render(<Header />);
    expect(screen.getByText('Coast FIRE 計算機')).toBeInTheDocument();
  });
});
```

### テストの実行

```bash
# すべてのテストを実行
npm test

# 監視モード（変更時に自動実行）
npm run test:watch

# カバレッジレポート生成
npm run test:coverage
```

### テストのベストプラクティス

1. **AAA パターン**: Arrange（準備）、Act（実行）、Assert（検証）
2. **わかりやすいテスト名**: `should` で始める
3. **1つのテストで1つのこと**: テストケースは単一の動作を検証
4. **モックの適切な使用**: 外部依存はモック化

## デバッグ方法

### ブラウザ開発者ツール

#### React Developer Tools

React コンポーネントの階層構造と state を確認できます。

```bash
# Chrome/Edge 拡張機能をインストール
# https://react.dev/learn/react-developer-tools
```

#### Console ログ

```typescript
// 開発時のみログを出力
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### TypeScript のエラー

```bash
# TypeScript の型チェックを実行
npx tsc --noEmit
```

### Next.js の詳細エラー

開発モードでは、Next.js が詳細なエラー情報を表示します。

```bash
npm run dev
```

## 開発ワークフロー

### 1. ブランチの作成

```bash
# main から最新のコードを取得
git checkout main
git pull origin main

# 新しいブランチを作成
git checkout -b feature/your-feature-name
```

### 2. コード変更

1. コードを編集
2. ESLint でチェック: `npm run lint`
3. テストを実行: `npm test`
4. ローカルでビルド: `npm run build`

### 3. コミット

```bash
# 変更をステージング
git add .

# コミット（意味のあるメッセージを記述）
git commit -m "feat: Add new feature for calculating real return rate"
```

### コミットメッセージの規約

以下のプレフィックスを使用：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント変更
- `style:` コードフォーマット（機能変更なし）
- `refactor:` リファクタリング
- `test:` テスト追加・修正
- `chore:` ビルドプロセスや補助ツールの変更

### 4. プルリクエスト

```bash
# リモートにプッシュ
git push origin feature/your-feature-name
```

GitHub でプルリクエストを作成し、以下を記述：

- 変更内容の説明
- 関連する Issue へのリンク
- スクリーンショット（UI 変更の場合）

### 5. CI の確認

GitHub Actions が自動で以下をチェックします：

- ESLint
- TypeScript 型チェック
- Jest テスト
- ビルド検証

すべてのチェックが通過することを確認してください。

## トラブルシューティング

### よくある問題と解決方法

#### 1. npm install が失敗する

```bash
# node_modules と package-lock.json を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 2. ポート 3000 が使用中

```bash
# 別のポートで起動
npm run dev -- --port 3001
```

#### 3. TypeScript エラーが消えない

```bash
# TypeScript サーバーを再起動（VSCode の場合）
# Command Palette (Ctrl+Shift+P) > "TypeScript: Restart TS Server"

# または、エディタを再起動
```

#### 4. Tailwind CSS のクラスが効かない

- `tailwind.config.ts` の `content` 設定を確認
- ファイルの保存を確認
- 開発サーバーを再起動

```bash
# 開発サーバーを再起動
# Ctrl+C で停止 → npm run dev
```

#### 5. Jest のテストがフリーズする

```bash
# キャッシュをクリア
npm test -- --clearCache
```

### パフォーマンスの問題

#### ビルドが遅い

```bash
# Turbopack を使用（開発時）
npm run dev  # すでに有効

# 依存関係のキャッシュをクリア
rm -rf .next
npm run dev
```

#### Hot Reload が遅い

- ファイル監視の上限を増やす（Linux）：

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### サポート

問題が解決しない場合は、以下の手順で報告してください：

1. GitHub Issues で新しい Issue を作成
2. 問題の詳細な説明を記載
3. エラーメッセージのスクリーンショットを添付
4. 環境情報（OS、Node.js バージョンなど）を記載

## 参考リソース

- [Next.js ドキュメント](https://nextjs.org/docs)
- [React ドキュメント](https://react.dev/)
- [TypeScript ドキュメント](https://www.typescriptlang.org/docs/)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Jest ドキュメント](https://jestjs.io/docs/getting-started)
- [React Testing Library ドキュメント](https://testing-library.com/docs/react-testing-library/intro/)

---

最終更新日: 2026-02-15
