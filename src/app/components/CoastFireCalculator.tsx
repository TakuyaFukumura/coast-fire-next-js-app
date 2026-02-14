'use client';

import { useState } from 'react';
import { CoastFireInput, CoastFireResult, DEFAULT_INPUT } from '@/types/coastFire';
import { calculateCoastFire } from '../../../lib/coastFireCalculations';
import InputForm from './InputForm';
import ResultDisplay from './ResultDisplay';
import AssetChart from './AssetChart';
import AssetTable from './AssetTable';

export default function CoastFireCalculator() {
  const [input, setInput] = useState<CoastFireInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<CoastFireResult | null>(() => {
    // 初回計算
    try {
      return calculateCoastFire(DEFAULT_INPUT);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (newInput: CoastFireInput) => {
    try {
      setError(null);
      const calculationResult = calculateCoastFire(newInput);
      setResult(calculationResult);
      setInput(newInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : '計算エラーが発生しました');
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Coast FIRE 計算機
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            老後の目標資産額を達成するために現時点で必要な資産額を計算します
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              <strong>エラー:</strong> {error}
            </p>
          </div>
        )}

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左サイド: 入力フォーム */}
          <div className="lg:col-span-1">
            <InputForm onCalculate={handleCalculate} defaultValues={input} />
          </div>

          {/* 右サイド: 計算結果 */}
          <div className="lg:col-span-2 space-y-8">
            {result && (
              <>
                {/* 計算結果表示 */}
                <ResultDisplay result={result} targetAmount={input.targetAmount} />

                {/* グラフ */}
                <AssetChart yearlyData={result.yearlyData} />

                {/* テーブル */}
                <AssetTable yearlyData={result.yearlyData} />
              </>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Coast FIRE（Coast Financial Independence, Retire Early）は、
            現時点で必要な資産を確保し、追加投資なしで複利運用のみで目標達成を目指す手法です。
          </p>
        </div>
      </div>
    </div>
  );
}
