# 現在の年齢欄へのrange input導入仕様書

## 概要

入力パラメータの「現在の年齢」欄に、他のフィールドと同様に `type="range"` の input（スライダー）を導入することで、ユーザビリティを向上させます。

**作成日**: 2026-02-17

## 背景と目的

### 現状

現在、入力パラメータには以下の5つのフィールドがあります：

1. ✅ 目標資産額（万円） - number input + range input
2. ❌ 現在の年齢 - number input のみ
3. ✅ 目標達成年齢 - number input + range input
4. ✅ 運用利回り（%） - number input + range input
5. ✅ インフレ率（%） - number input + range input

「現在の年齢」フィールドだけが range input を持っておらず、他のフィールドと操作感が統一されていません。

### 目的

- ユーザー体験の統一性向上
- 直感的な値の調整を可能にする
- アクセシビリティの向上（スライダーによる視覚的なフィードバック）

## 現在の実装

### コード位置

ファイル: `src/app/components/InputForm.tsx`  
対象箇所: 74-93行目

```tsx
{/* 現在の年齢 */}
<div className="space-y-2">
    <label htmlFor="currentAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        現在の年齢
    </label>
    <input
        type="number"
        id="currentAge"
        value={Number.isNaN(currentAge) ? '' : currentAge}
        onChange={(e) => {
            const value = e.target.valueAsNumber;
            setCurrentAge(Number.isNaN(value) ? 0 : value);
        }}
        min={0}
        max={99}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
        required
    />
    <p className="text-xs text-gray-500 dark:text-gray-400">範囲: 0歳〜99歳</p>
</div>
```

### 現在のパラメータ

- **最小値**: 0歳
- **最大値**: 99歳
- **ステップ**: 1（整数のみ）
- **デフォルト値**: 28歳（`DEFAULT_INPUT.currentAge`）

## 改修仕様

### 1. 追加する要素

number input の下に、range input を追加します。

### 2. range input の仕様

#### 基本属性

| 属性 | 値 | 説明 |
|------|-----|------|
| `type` | `"range"` | スライダー形式の入力 |
| `value` | `Number.isNaN(currentAge) ? 28 : currentAge` | デフォルト値は28歳 |
| `min` | `0` | 最小値: 0歳 |
| `max` | `99` | 最大値: 99歳 |
| `step` | `1` | ステップ: 1歳単位 |
| `className` | `"w-full"` | 横幅100% |
| `aria-label` | `"現在の年齢"` | アクセシビリティ対応 |

#### イベントハンドラ

```tsx
onChange={(e) => setCurrentAge(Number(e.target.value))}
```

- `e.target.value` は文字列なので、`Number()` で数値に変換
- 他のフィールドと同じパターンを使用

### 3. UI/UX の考慮事項

#### レイアウト

- number input と range input の間隔は他のフィールドと同様に `space-y-2` で統一
- 範囲説明テキストは range input の下に配置

#### 動作

- number input と range input は双方向で連動
- どちらを操作しても、もう一方の値も更新される
- 無効な値（NaN）の場合、デフォルト値（28歳）を表示

#### バリデーション

- number input の `required` 属性は維持
- `min="0"` と `max="99"` による入力制限
- 整数のみ入力可能（`step="1"`）

### 4. 他のフィールドとの整合性確認

#### 目標達成年齢との関係

現在の実装では、`currentAge` と `targetAge` の整合性チェックは行っていません。これは以下の理由によります：

1. ユーザーが自由に値を試せる柔軟性を重視
2. バリデーションエラーよりも計算結果を表示することを優先
3. `currentAge >= targetAge` の場合も計算ロジック上は動作可能

この仕様は維持します。

### 5. 実装コード例

```tsx
{/* 現在の年齢 */}
<div className="space-y-2">
    <label htmlFor="currentAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        現在の年齢
    </label>
    <input
        type="number"
        id="currentAge"
        value={Number.isNaN(currentAge) ? '' : currentAge}
        onChange={(e) => {
            const value = e.target.valueAsNumber;
            setCurrentAge(Number.isNaN(value) ? 0 : value);
        }}
        min={0}
        max={99}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
        required
    />
    <input
        type="range"
        value={Number.isNaN(currentAge) ? 28 : currentAge}
        onChange={(e) => setCurrentAge(Number(e.target.value))}
        min={0}
        max={99}
        step={1}
        className="w-full"
        aria-label="現在の年齢"
    />
    <p className="text-xs text-gray-500 dark:text-gray-400">範囲: 0歳〜99歳</p>
</div>
```

## テスト項目

### 1. 機能テスト

- [ ] number input に値を入力した時、range input のスライダー位置が連動する
- [ ] range input のスライダーを動かした時、number input の値が連動する
- [ ] 0歳から99歳までの全範囲で正常に動作する
- [ ] デフォルト値（28歳）が正しく設定される
- [ ] リセットボタンでデフォルト値に戻る

### 2. バリデーションテスト

- [ ] 0未満の値を number input に入力できない
- [ ] 100以上の値を number input に入力できない
- [ ] range input は0〜99の範囲のみスライド可能

### 3. UI/UXテスト

- [ ] ダークモードで正常に表示される
- [ ] モバイル端末でスライダーが操作可能
- [ ] 他のフィールドとデザインが統一されている
- [ ] レスポンシブデザインが維持されている

### 4. アクセシビリティテスト

- [ ] スクリーンリーダーで `aria-label` が読み上げられる
- [ ] キーボード操作（Tab、矢印キー）で range input を操作可能
- [ ] フォーカス時の視覚的フィードバックがある

## リスクと対策

### リスク1: 既存の動作への影響

**リスク**: 新しい input 要素の追加により、既存の動作に影響が出る可能性

**対策**: 
- number input の仕様は一切変更しない
- range input は完全に新規追加のみ
- 既存のテストケースが全て通過することを確認

### リスク2: パフォーマンスへの影響

**リスク**: range input の `onChange` イベントが頻繁に発火する可能性

**対策**:
- 他のフィールドでも同様の実装で問題が出ていないため、影響は軽微と判断
- 必要に応じてデバウンス処理を検討（ただし、現時点では不要と判断）

### リスク3: モバイルでの操作性

**リスク**: スマートフォンでのスライダー操作が難しい可能性

**対策**:
- number input は引き続き利用可能なので、代替手段がある
- Tailwind CSS のレスポンシブデザインを活用
- 実機テストで操作性を確認

## 実装スケジュール（想定）

1. **実装**: 30分
   - InputForm.tsx の修正
   
2. **テスト**: 30分
   - 手動テスト（デスクトップ、モバイル、ダークモード）
   - 既存テストの実行確認
   
3. **ドキュメント更新**: 15分
   - 必要に応じて README.md や CHANGELOG.md を更新

**合計**: 約1時間15分

## 参考情報

### 関連ファイル

- `src/app/components/InputForm.tsx`: 入力フォームコンポーネント
- `src/types/coastFire.ts`: 型定義とデフォルト値
- `__tests__/components/InputForm.test.tsx`: 入力フォームのテスト（存在する場合）

### 類似実装の参考箇所

- 目標資産額: 61-71行目
- 目標達成年齢: 113-122行目
- 運用利回り: 144-154行目
- インフレ率: 176-186行目

すべて同じパターンで実装されており、コードの一貫性が保たれています。

## 承認・レビュー

### レビューポイント

- [ ] 仕様内容が要件を満たしているか
- [ ] 実装方法が適切か
- [ ] テスト項目が十分か
- [ ] リスク対策が適切か

### 承認後の作業

1. InputForm.tsx の修正実装
2. 動作確認
3. PR作成
4. コードレビュー
5. マージ

---

**文書履歴**

- 2026-02-17: 初版作成
