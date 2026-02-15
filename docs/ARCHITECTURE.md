# アーキテクチャ設計書

## 目次

1. [システム概要](#システム概要)
2. [アーキテクチャの原則](#アーキテクチャの原則)
3. [レイヤー構造](#レイヤー構造)
4. [コンポーネント設計](#コンポーネント設計)
5. [データフロー](#データフロー)
6. [状態管理](#状態管理)
7. [ルーティング](#ルーティング)
8. [スタイリング戦略](#スタイリング戦略)
9. [パフォーマンス最適化](#パフォーマンス最適化)
10. [セキュリティ考慮事項](#セキュリティ考慮事項)

## システム概要

Coast FIRE Next.js アプリケーションは、老後資産形成計画を支援する Single Page Application (SPA) です。

### 主要機能

1. **Coast FIRE 計算**: 目標資産額達成に必要な現在の資産額を計算
2. **データ可視化**: 年齢別の資産推移をグラフとテーブルで表示
3. **インタラクティブな入力**: スライダーと数値入力による直感的な操作
4. **ダークモード**: ユーザーの好みに応じたテーマ切り替え

### 技術選定の理由

| 技術 | 選定理由 |
|------|---------|
| **Next.js 16** | - React フレームワークのデファクトスタンダード<br>- App Router によるファイルベースルーティング<br>- Turbopack による高速開発体験<br>- Server Components による最適化 |
| **TypeScript** | - 型安全性による開発時のエラー検出<br>- IDE の補完機能向上<br>- リファクタリングの容易さ |
| **Tailwind CSS** | - ユーティリティファーストによる高速開発<br>- カスタマイズ性の高さ<br>- レスポンシブデザインの容易な実装 |
| **Recharts** | - React との高い親和性<br>- 宣言的な API<br>- カスタマイズ可能なチャート |
| **Jest + RTL** | - React コンポーネントのテストに最適<br>- 充実したコミュニティとドキュメント |

## アーキテクチャの原則

### 1. 関心の分離（Separation of Concerns）

各レイヤーは明確な責任を持ち、相互依存を最小限にします。

```
表示層 (UI Components)
    ↓
ビジネスロジック層 (lib/)
    ↓
型定義層 (types/)
```

### 2. 単一責任の原則（Single Responsibility Principle）

各コンポーネント・関数は1つの責任のみを持ちます。

**例**: `InputForm` は入力のみ、`ResultDisplay` は結果表示のみを担当

### 3. 再利用性（Reusability）

コンポーネントやユーティリティ関数は汎用的に設計し、複数箇所で再利用可能にします。

### 4. テスタビリティ（Testability）

ビジネスロジックを UI から分離し、単体テストを容易にします。

### 5. 型安全性（Type Safety）

すべての関数、コンポーネントに TypeScript の型を定義し、実行時エラーを最小化します。

## レイヤー構造

### 1. 表示層（Presentation Layer）

**場所**: `src/app/components/`

**責任**:
- UI の描画
- ユーザーインタラクションの処理
- ビジネスロジック層への委譲

**特徴**:
- React コンポーネント
- Client Components (`'use client'`)
- ビジネスロジックを含まない

**例**:
```typescript
// src/app/components/InputForm.tsx
'use client';

export default function InputForm({ onCalculate, defaultValues }) {
  // UI ロジックのみ
  // 計算ロジックは呼び出し元に委譲
}
```

### 2. ビジネスロジック層（Business Logic Layer）

**場所**: `lib/`

**責任**:
- Coast FIRE の計算
- 入力値のバリデーション
- データの変換・フォーマット

**特徴**:
- React/Next.js に依存しない純粋な TypeScript
- 100% テストカバレッジ
- 再利用可能

**例**:
```typescript
// lib/coastFireCalculations.ts
export function calculateCoastFire(input: CoastFireInput): CoastFireResult {
  // ビジネスロジックの実装
}
```

### 3. 型定義層（Type Definition Layer）

**場所**: `src/types/`

**責任**:
- データ構造の定義
- インターフェースの定義
- 型の一元管理

**特徴**:
- TypeScript の interface/type のみ
- ランタイムコードを含まない
- 各層で共有

**例**:
```typescript
// src/types/coastFire.ts
export interface CoastFireInput {
  targetAmount: number;
  targetAge: number;
  // ...
}
```

### レイヤー間の依存関係

```
┌─────────────────────────┐
│   表示層 (Components)   │
│  src/app/components/    │
└───────────┬─────────────┘
            │ 使用
            ↓
┌─────────────────────────┐
│ ビジネスロジック層 (lib)│
│  lib/                   │
└───────────┬─────────────┘
            │ 使用
            ↓
┌─────────────────────────┐
│   型定義層 (types)      │
│  src/types/             │
└─────────────────────────┘
```

**重要**: 下位層は上位層に依存してはいけません（依存性逆転の原則）

## コンポーネント設計

### コンポーネント階層

```
App (layout.tsx)
├── DarkModeProvider
│   └── Header
│
└── CoastFireCalculator (メインコンテナ)
    ├── InputForm
    │   └── (各入力フィールド)
    ├── ResultDisplay
    ├── AssetChart
    │   └── Recharts (LineChart)
    └── AssetTable
        └── (テーブル行)
```

### コンポーネントの種類

#### 1. コンテナコンポーネント（Container Components）

**役割**: ビジネスロジックと状態管理

**例**: `CoastFireCalculator.tsx`

```typescript
export default function CoastFireCalculator() {
  const [input, setInput] = useState<CoastFireInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<CoastFireResult | null>(null);
  
  const handleCalculate = (newInput: CoastFireInput) => {
    const calculationResult = calculateCoastFire(newInput);
    setResult(calculationResult);
  };
  
  return (
    <>
      <InputForm onCalculate={handleCalculate} />
      <ResultDisplay result={result} />
    </>
  );
}
```

**特徴**:
- 状態を保持
- 子コンポーネントにデータを渡す
- ビジネスロジックを呼び出す

#### 2. プレゼンテーションコンポーネント（Presentation Components）

**役割**: UI の表示のみ

**例**: `ResultDisplay.tsx`

```typescript
interface ResultDisplayProps {
  result: CoastFireResult;
  targetAmount: number;
}

export default function ResultDisplay({ result, targetAmount }: ResultDisplayProps) {
  return (
    <div>
      {/* 結果の表示 */}
    </div>
  );
}
```

**特徴**:
- 状態を持たない（stateless）
- Props 経由でデータを受け取る
- 純粋な表示ロジックのみ

#### 3. プロバイダーコンポーネント（Provider Components）

**役割**: Context API による状態の共有

**例**: `DarkModeProvider.tsx`

```typescript
export default function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
```

**特徴**:
- Context API を使用
- グローバルな状態を管理
- 子コンポーネントに状態を提供

## データフロー

### 単方向データフロー（Unidirectional Data Flow）

```
┌─────────────────────────────────────────────────┐
│           CoastFireCalculator                   │
│         (状態: input, result)                   │
└──────┬─────────────────────────┬────────────────┘
       │                         │
       │ Props (defaultValues)   │ Props (result)
       │ Callback (onCalculate)  │
       ↓                         ↓
┌──────────────┐         ┌────────────────┐
│  InputForm   │         │ ResultDisplay  │
│              │         │  AssetChart    │
│              │         │  AssetTable    │
└──────┬───────┘         └────────────────┘
       │
       │ ユーザー入力
       ↓
┌──────────────┐
│ onCalculate  │
│   コールバック │
└──────┬───────┘
       │
       ↓
┌────────────────────────┐
│ calculateCoastFire()   │
│ (lib/計算ロジック)      │
└────────────────────────┘
```

### イベントフロー

1. **ユーザー入力**: `InputForm` でユーザーが値を変更
2. **コールバック呼び出し**: `onCalculate` が実行される
3. **計算実行**: `calculateCoastFire` が実行される
4. **状態更新**: `CoastFireCalculator` の state が更新
5. **再レンダリング**: 子コンポーネントが新しい Props で再レンダリング

## 状態管理

### ローカル状態（Local State）

React の `useState` を使用してコンポーネント単位で状態を管理します。

```typescript
// コンポーネント内の状態
const [input, setInput] = useState<CoastFireInput>(DEFAULT_INPUT);
const [result, setResult] = useState<CoastFireResult | null>(null);
```

**使用場面**:
- コンポーネント内で完結する状態
- 計算結果や入力値

### グローバル状態（Global State）

Context API を使用してアプリケーション全体で共有する状態を管理します。

```typescript
// DarkModeProvider
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
}
```

**使用場面**:
- ダークモード設定
- ユーザー設定
- 複数コンポーネントで共有する状態

### 永続化（Persistence）

`localStorage` を使用してブラウザに状態を保存します。

```typescript
// ダークモード設定の永続化
useEffect(() => {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    setIsDarkMode(saved === 'true');
  }
}, []);

useEffect(() => {
  localStorage.setItem('darkMode', String(isDarkMode));
}, [isDarkMode]);
```

## ルーティング

### App Router の構造

```
src/app/
├── layout.tsx           # ルートレイアウト（全ページ共通）
├── page.tsx             # / (ホームページ、リダイレクト)
└── coast-fire/
    └── page.tsx         # /coast-fire (メインページ)
```

### ルーティングの特徴

1. **ファイルシステムベース**: ディレクトリ構造がそのまま URL になる
2. **Server Components**: デフォルトでサーバーサイドレンダリング
3. **レイアウトの共有**: `layout.tsx` で共通レイアウトを定義

### リダイレクト

```typescript
// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/coast-fire');
}
```

## スタイリング戦略

### Tailwind CSS の使用

#### ユーティリティファースト

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  {/* コンテンツ */}
</div>
```

#### レスポンシブデザイン

モバイルファーストのブレークポイント：

```tsx
<div className="text-sm md:text-base lg:text-lg">
  {/* 小画面: 14px, 中画面: 16px, 大画面: 18px */}
</div>
```

#### ダークモード

クラスベースのダークモード：

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
  {/* ライトモード: 白背景+黒文字、ダークモード: 黒背景+白文字 */}
</div>
```

### グローバルスタイル

`src/app/globals.css` でグローバルスタイルを定義：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムスタイル */
```

## パフォーマンス最適化

### 1. Server Components の活用

```typescript
// デフォルトで Server Component
export default async function Page() {
  // サーバーサイドで実行
  const data = await fetchData();
  return <div>{data}</div>;
}
```

**メリット**:
- JavaScript バンドルサイズの削減
- 初期レンダリング速度の向上

### 2. Client Components の最適化

```typescript
// 必要な箇所のみ Client Component
'use client';

export default function InteractiveComponent() {
  const [state, setState] = useState(0);
  return <button onClick={() => setState(state + 1)}>{state}</button>;
}
```

### 3. 遅延読み込み（Lazy Loading）

```typescript
import dynamic from 'next/dynamic';

// 重いコンポーネントを遅延読み込み
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>読み込み中...</p>,
  ssr: false, // SSR を無効化
});
```

### 4. メモ化（Memoization）

```typescript
import { useMemo, useCallback } from 'react';

// 計算結果をメモ化
const result = useMemo(() => {
  return expensiveCalculation(input);
}, [input]);

// コールバック関数をメモ化
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

## セキュリティ考慮事項

### 1. XSS（クロスサイトスクリプティング）対策

React は自動的に値をエスケープします：

```typescript
// 安全: React が自動エスケープ
<div>{userInput}</div>

// 危険: dangerouslySetInnerHTML は避ける
// <div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 2. 入力値のバリデーション

```typescript
function validateInput(input: CoastFireInput): void {
  // 数値の妥当性チェック
  if (!Number.isFinite(input.targetAmount)) {
    throw new Error('無効な入力値');
  }
  
  // 範囲チェック
  if (input.targetAmount < 100 || input.targetAmount > 100000) {
    throw new Error('範囲外の値');
  }
}
```

### 3. 型安全性

TypeScript による型チェックで実行時エラーを防止：

```typescript
// 型定義により不正な値を防ぐ
interface CoastFireInput {
  targetAmount: number;  // 文字列は許可されない
  targetAge: number;
  // ...
}
```

### 4. 依存関係の管理

- **Dependabot**: 自動的に依存関係を更新
- **npm audit**: 脆弱性のスキャン

```bash
npm audit
npm audit fix
```

### 5. 環境変数の管理

機密情報は環境変数で管理：

```typescript
// .env.local (Git に含めない)
NEXT_PUBLIC_API_KEY=your_api_key

// コード内
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

## まとめ

Coast FIRE Next.js アプリケーションは、以下の設計原則に基づいて構築されています：

1. **関心の分離**: レイヤー構造による明確な責任分担
2. **型安全性**: TypeScript による堅牢なコード
3. **テスタビリティ**: ビジネスロジックの分離による容易なテスト
4. **パフォーマンス**: Server Components と最適化戦略
5. **セキュリティ**: 入力検証と型チェック

この設計により、保守性・拡張性・品質の高いアプリケーションを実現しています。

---

最終更新日: 2026-02-15
