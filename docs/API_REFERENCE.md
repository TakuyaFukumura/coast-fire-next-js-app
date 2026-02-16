# API リファレンス

## 目次

1. [計算ロジック API](#計算ロジック-api)
2. [型定義](#型定義)
3. [コンポーネント API](#コンポーネント-api)
4. [ユーティリティ関数](#ユーティリティ関数)
5. [Context API](#context-api)

## 計算ロジック API

### `calculateCoastFire()`

Coast FIRE の計算を行うメイン関数です。

#### シグネチャ

```typescript
function calculateCoastFire(input: CoastFireInput): CoastFireResult
```

#### パラメータ

| 名前      | 型                | 説明            |
|---------|------------------|---------------|
| `input` | `CoastFireInput` | 計算に必要な入力パラメータ |

#### 戻り値

`CoastFireResult` オブジェクト

#### 例外

入力値が不正な場合、`Error` をスローします。

#### 使用例

```typescript
import { calculateCoastFire } from '../../../lib/coastFireCalculations';

const input: CoastFireInput = {
  targetAmount: 2000,      // 2000万円
  targetAge: 65,           // 65歳
  currentAge: 28,          // 28歳
  returnRate: 0.05,        // 5%
  inflationRate: 0.02,     // 2%
};

try {
  const result = calculateCoastFire(input);
  console.log('現在必要な資産額:', result.requiredAmount);
  console.log('運用年数:', result.investmentYears);
} catch (error) {
  console.error('計算エラー:', error.message);
}
```

#### 計算ロジック

1. **実質利回りの計算（フィッシャー方程式）**
   ```
   実質利回り = (1 + 運用利回り) / (1 + インフレ率) - 1
   ```

2. **現在必要な資産額の計算**
   ```
   現在必要な資産額 = 目標資産額 / (1 + 実質利回り)^運用年数
   ```

3. **年齢ごとのデータ計算**
    - 名目資産額: `現在必要な資産額 × (1 + 運用利回り)^経過年数`
    - 実質価値: `名目資産額 / (1 + インフレ率)^経過年数`

#### バリデーション

以下の条件を満たさない場合、エラーをスローします：

| パラメータ           | 条件                                     |
|-----------------|----------------------------------------|
| `targetAmount`  | 100 ≤ x ≤ 100,000（100万円〜10億円）          |
| `currentAge`    | 0 ≤ x ≤ 99（0歳〜99歳）                     |
| `targetAge`     | 30 ≤ x ≤ 100 かつ currentAge < targetAge |
| `returnRate`    | 0 ≤ x ≤ 0.2（0%〜20%）                    |
| `inflationRate` | 0 ≤ x ≤ 0.1（0%〜10%）                    |

すべての値は有限の数値である必要があります（NaN、Infinity は不可）。

---

### `formatAmount()`

金額を日本語形式（万円単位）でフォーマットします。

#### シグネチャ

```typescript
function formatAmount(amount: number): string
```

#### パラメータ

| 名前       | 型        | 説明              |
|----------|----------|-----------------|
| `amount` | `number` | フォーマット対象の金額（万円） |

#### 戻り値

フォーマットされた文字列（例: "1,234万円"）

#### 使用例

```typescript
import { formatAmount } from '../../../lib/coastFireCalculations';

console.log(formatAmount(1234));      // "1,234万円"
console.log(formatAmount(10000));     // "10,000万円"
console.log(formatAmount(500.8));     // "501万円"（四捨五入）
```

---

### `formatPercentage()`

パーセンテージをフォーマットします。

#### シグネチャ

```typescript
function formatPercentage(rate: number, decimalPlaces?: number): string
```

#### パラメータ

| 名前              | 型        | デフォルト | 説明                      |
|-----------------|----------|-------|-------------------------|
| `rate`          | `number` | -     | フォーマット対象の割合（小数、例: 0.05） |
| `decimalPlaces` | `number` | `2`   | 小数点以下の桁数                |

#### 戻り値

フォーマットされた文字列（例: "5.00%"）

#### 使用例

```typescript
import { formatPercentage } from '../../../lib/coastFireCalculations';

console.log(formatPercentage(0.05));        // "5.00%"
console.log(formatPercentage(0.123, 3));    // "12.300%"
console.log(formatPercentage(0.05, 0));     // "5%"
```

---

## 型定義

### `CoastFireInput`

Coast FIRE 計算の入力パラメータの型です。

#### 定義

```typescript
interface CoastFireInput {
  /** 目標資産額（万円） - 現在価値ベース */
  targetAmount: number;
  
  /** 目標達成年齢 */
  targetAge: number;
  
  /** 現在の年齢 */
  currentAge: number;
  
  /** 運用利回り（小数、例: 0.05 = 5%） */
  returnRate: number;
  
  /** インフレ率（小数、例: 0.02 = 2%） */
  inflationRate: number;
}
```

#### 使用例

```typescript
import type { CoastFireInput } from '@/types/coastFire';

const input: CoastFireInput = {
  targetAmount: 2000,
  targetAge: 65,
  currentAge: 28,
  returnRate: 0.05,
  inflationRate: 0.02,
};
```

---

### `CoastFireResult`

Coast FIRE 計算の結果の型です。

#### 定義

```typescript
interface CoastFireResult {
  /** 現在必要な資産額（万円） */
  requiredAmount: number;
  
  /** 年齢ごとのデータ */
  yearlyData: YearlyData[];
  
  /** 実質利回り */
  realReturnRate: number;
  
  /** 運用年数 */
  investmentYears: number;
  
  /** 目標年齢時点での名目資産額（万円） */
  targetNominalAmount: number;
}
```

---

### `YearlyData`

年齢ごとの資産データの型です。

#### 定義

```typescript
interface YearlyData {
  /** 年齢 */
  age: number;
  
  /** 資産額（名目、万円） */
  amount: number;
  
  /** インフレ調整後価値（実質、万円） */
  inflationAdjusted: number;
  
  /** 実質利回り累計（%） - 開始時点からの累積実質リターン */
  realReturn: number;
}
```

#### 使用例

```typescript
import type { YearlyData } from '@/types/coastFire';

const data: YearlyData = {
  age: 30,
  amount: 1500,
  inflationAdjusted: 1450,
  realReturn: 5.2,
};
```

---

### `DEFAULT_INPUT`

デフォルトの入力値を定義した定数です。

#### 定義

```typescript
const DEFAULT_INPUT: CoastFireInput = {
  targetAmount: 2000,    // 2000万円
  targetAge: 65,         // 65歳
  currentAge: 28,        // 28歳
  returnRate: 0.05,      // 5%
  inflationRate: 0.02,   // 2%
};
```

#### 使用例

```typescript
import { DEFAULT_INPUT } from '@/types/coastFire';

const [input, setInput] = useState<CoastFireInput>(DEFAULT_INPUT);
```

---

## コンポーネント API

### `CoastFireCalculator`

Coast FIRE 計算機のメインコンテナコンポーネントです。

#### Props

なし（props を受け取りません）

#### 使用例

```typescript
import CoastFireCalculator from '@/app/components/CoastFireCalculator';

export default function Page() {
    return <CoastFireCalculator / >;
}
```

#### 内部状態

- `input: CoastFireInput` - 入力値
- `result: CoastFireResult | null` - 計算結果
- `error: string | null` - エラーメッセージ

---

### `InputForm`

入力フォームコンポーネントです。

#### Props

```typescript
interface InputFormProps {
    /** 計算実行時のコールバック */
    onCalculate: (input: CoastFireInput) => void;

    /** 初期値（省略可能、デフォルトは DEFAULT_INPUT） */
    defaultValues?: CoastFireInput;
}
```

#### 使用例

```typescript
import InputForm from '@/app/components/InputForm';

function MyComponent() {
  const handleCalculate = (input: CoastFireInput) => {
    console.log('計算実行:', input);
  };
  
  return (
    <InputForm 
      onCalculate={handleCalculate}
      defaultValues={DEFAULT_INPUT}
    />
  );
}
```

#### 機能

- スライダーと数値入力の両方をサポート
- フォーム送信（再計算ボタン）またはリセット時に計算を実行
- HTML の `min`、`max`、`required` 属性による基本的な入力制約

---

### `ResultDisplay`

計算結果を表示するコンポーネントです。

#### Props

```typescript
interface ResultDisplayProps {
  /** 計算結果 */
  result: CoastFireResult;
  
  /** 目標資産額（万円） */
  targetAmount: number;
}
```

#### 使用例

```typescript
import ResultDisplay from '@/app/components/ResultDisplay';

function MyComponent() {
  return (
    <ResultDisplay 
      result={calculationResult}
      targetAmount={2000}
    />
  );
}
```

#### 表示内容

- 現在必要な資産額
- 運用年数
- 実質利回り
- 目標年齢時点での名目資産額

---

### `AssetChart`

資産推移をグラフで表示するコンポーネントです。

#### Props

```typescript
interface AssetChartProps {
  /** 年齢ごとのデータ */
  yearlyData: YearlyData[];
}
```

#### 使用例

```typescript
import AssetChart from '@/app/components/AssetChart';

function MyComponent() {
  return <AssetChart yearlyData={result.yearlyData} />;
}
```

#### 機能

- Recharts の LineChart を使用
- 名目資産額と実質価値の2つの線を表示
- レスポンシブデザイン
- ツールチップ表示

---

### `AssetTable`

資産データをテーブルで表示するコンポーネントです。

#### Props

```typescript
interface AssetTableProps {
  /** 年齢ごとのデータ */
  yearlyData: YearlyData[];
}
```

#### 使用例

```typescript
import AssetTable from '@/app/components/AssetTable';

function MyComponent() {
  return <AssetTable yearlyData={result.yearlyData} />;
}
```

#### 機能

- ソート機能（年齢、金額など）
- ページネーション（10件ずつ表示）
- レスポンシブテーブル

---

### `Header`

ヘッダーコンポーネントです。

#### Props

なし

#### 使用例

```typescript
import Header from '@/app/components/Header';

function MyLayout() {
  return (
    <>
      <Header />
      {/* コンテンツ */}
    </>
  );
}
```

#### 機能

- アプリケーション名の表示
- ダークモード切り替えボタン

---

### `DarkModeProvider`

ダークモード機能を提供する Provider コンポーネントです。

#### Props

```typescript
interface DarkModeProviderProps {
  /** 子要素 */
  children: React.ReactNode;
}
```

#### 使用例

```typescript
import { DarkModeProvider } from '@/app/components/DarkModeProvider';

function MyApp({ children }) {
  return (
    <DarkModeProvider>
      {children}
    </DarkModeProvider>
  );
}
```

#### 提供する値

```typescript
type Theme = 'light' | 'dark';

interface DarkModeContextType {
  /** 現在のテーマ */
  theme: Theme;
  
  /** テーマの設定 */
  setTheme: (theme: Theme) => void;
  
  /** ダークモードが有効かどうか */
  isDark: boolean;
}
```

---

## ユーティリティ関数

このアプリケーションでは、主要なユーティリティ関数は計算ロジック内に含まれています。

### 数値フォーマット関連

- `formatAmount(amount: number): string` - 金額のフォーマット
- `formatPercentage(rate: number, decimalPlaces?: number): string` - パーセンテージのフォーマット

詳細は[計算ロジック API](#計算ロジック-api)を参照してください。

---

## Context API

### `DarkModeContext`

ダークモードの状態を管理する Context です。

#### 作成

```typescript
import { createContext } from 'react';

type Theme = 'light' | 'dark';

interface DarkModeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);
```

#### カスタムフック: `useDarkMode()`

```typescript
import { useDarkMode } from '@/app/components/DarkModeProvider';

function MyComponent() {
  const { theme, setTheme, isDark } = useDarkMode();
  
  return (
    <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? 'ライトモード' : 'ダークモード'}
    </button>
  );
}
```

#### 例外

`DarkModeProvider` の外で `useDarkMode()` を使用すると、以下のエラーがスローされます：

```
Error: useDarkMode must be used within a DarkModeProvider
```

---

## エラーハンドリング

### 計算エラー

`calculateCoastFire()` 関数は、入力値が不正な場合に `Error` をスローします。

#### エラーメッセージの例

| エラー                             | 説明                      |
|---------------------------------|-------------------------|
| `目標資産額には有限の数値を入力してください`         | NaN または Infinity が入力された |
| `目標資産額は正の値を入力してください`            | 0 以下の値が入力された            |
| `目標資産額は100万円から10億円の範囲で入力してください` | 範囲外の値                   |
| `現在の年齢は0歳から99歳の範囲で入力してください`     | 範囲外の年齢                  |
| `目標達成年齢は現在の年齢より大きい値を入力してください`   | 目標年齢 ≤ 現在年齢             |
| `運用利回りは0%から20%の範囲で入力してください`     | 範囲外の利回り                 |
| `インフレ率は0%から10%の範囲で入力してください`     | 範囲外のインフレ率               |

#### エラーハンドリングの例

```typescript
try {
  const result = calculateCoastFire(input);
  // 正常処理
} catch (error) {
  if (error instanceof Error) {
    console.error('エラー:', error.message);
    // エラーメッセージを表示
    setErrorMessage(error.message);
  }
}
```

---

## 型のインポート

### インポート方法

#### 計算ロジック

コンポーネントからの相対パスでインポートします：

```typescript
// src/app/components/ からの場合
import { calculateCoastFire, formatAmount, formatPercentage } from '../../../lib/coastFireCalculations';
```

#### 型定義

`@/types/coastFire` のパスエイリアスが使用可能です：

```typescript
import type { CoastFireInput, CoastFireResult, YearlyData } from '@/types/coastFire';
import { DEFAULT_INPUT } from '@/types/coastFire';
```

#### Context

`@/app/components/DarkModeProvider` のパスエイリアスが使用可能です：

```typescript
import { useDarkMode } from '@/app/components/DarkModeProvider';
```

### 使用例

```typescript
// コンポーネント内での実際の使用例
import { calculateCoastFire, formatAmount } from '../../../lib/coastFireCalculations';
import type { CoastFireInput, CoastFireResult } from '@/types/coastFire';
import { DEFAULT_INPUT } from '@/types/coastFire';
import { useDarkMode } from '@/app/components/DarkModeProvider';
```

**注意**: `lib/` ディレクトリは `src/` の外にあるため、`@/` エイリアスではアクセスできません。相対パスを使用してください。

---

## バージョン情報

- **API バージョン**: 1.0.0
- **最終更新日**: 2026-02-15

---

## 変更履歴

### v1.0.0 (2026-02-15)

- 初版リリース
- Coast FIRE 計算機能の実装
- 基本的なコンポーネント API の定義

---

## サポート

API に関する質問や問題が発生した場合は、GitHub Issues で報告してください。

- リポジトリ: https://github.com/TakuyaFukumura/coast-fire-next-js-app
- Issues: https://github.com/TakuyaFukumura/coast-fire-next-js-app/issues

---

最終更新日: 2026-02-15
