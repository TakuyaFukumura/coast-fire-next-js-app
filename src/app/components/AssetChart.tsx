'use client';

import { YearlyData } from '@/types/coastFire';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatAmount } from '../../../lib/coastFireCalculations';

interface AssetChartProps {
  yearlyData: YearlyData[];
}

export default function AssetChart({ yearlyData }: AssetChartProps) {
  // カスタムツールチップ
  interface TooltipPayload {
    payload: YearlyData;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{data.age}歳</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            名目資産額: {formatAmount(data.amount)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            実質価値: {formatAmount(data.inflationAdjusted)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            実質利回り累計: {data.realReturn.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Y軸のフォーマット関数
  const formatYAxis = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}億円`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}千万円`;
    }
    return `${value}万円`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">資産推移グラフ</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={yearlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
            <XAxis
              dataKey="age"
              label={{ value: '年齢', position: 'insideBottom', offset: -5 }}
              className="text-gray-700 dark:text-gray-300"
              tickFormatter={(value) => `${value}歳`}
            />
            <YAxis
              label={{ value: '資産額', angle: -90, position: 'insideLeft' }}
              className="text-gray-700 dark:text-gray-300"
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  amount: '資産額（名目）',
                  inflationAdjusted: 'インフレ調整後価値（実質）',
                };
                return labels[value] || value;
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              name="資産額（名目）"
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="inflationAdjusted"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="インフレ調整後価値（実質）"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        ※ 青色の実線は名目資産額、グレーの点線はインフレ調整後の実質価値を示しています。
      </p>
    </div>
  );
}
