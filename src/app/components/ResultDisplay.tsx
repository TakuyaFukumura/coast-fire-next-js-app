'use client';

import {CoastFireResult} from '@/types/coastFire';
import {formatAmount, formatPercentage} from '../../../lib/coastFireCalculations';

interface ResultDisplayProps {
    readonly result: CoastFireResult;
    readonly targetAmount: number;
}

export default function ResultDisplay({result, targetAmount}: ResultDisplayProps) {
    const {requiredAmount, investmentYears, targetNominalAmount} = result;

    return (
        <div
            className="bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">計算結果</h2>

            {/* 現在必要な資産額 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">現在必要な資産額</p>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 text-center">
                    {formatAmount(requiredAmount)}
                </p>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">目標資産額（現在価値）</span>
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {formatAmount(targetAmount)}
            </span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">運用期間</span>
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {investmentYears}年
            </span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">実質利回り</span>
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {formatPercentage(result.realReturnRate)}
            </span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">目標年齢時の名目額</span>
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {formatAmount(targetNominalAmount)}
              </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            ※ インフレを考慮した実際の金額
                        </p>
                    </div>
                </div>
            </div>

            {/* 注記 */}
            <div
                className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>注記：</strong> 目標資産額は「現在の購買力ベース」での金額です。
                    インフレを考慮すると、目標年齢時点での実際の名目金額はより大きくなります。
                </p>
            </div>
        </div>
    );
}
