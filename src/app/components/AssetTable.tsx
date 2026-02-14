'use client';

import { YearlyData } from '@/types/coastFire';
import { formatAmount } from '../../../lib/coastFireCalculations';
import { useState } from 'react';

interface AssetTableProps {
  yearlyData: YearlyData[];
}

export default function AssetTable({ yearlyData }: AssetTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof YearlyData>('age');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  // ソート処理
  const sortedData = [...yearlyData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return aValue < bValue ? -1 * multiplier : aValue > bValue ? 1 * multiplier : 0;
  });

  // ページネーション処理
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // ソート切り替え
  const handleSort = (field: keyof YearlyData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // ソート時にページを1にリセット
  };

  // キーボードイベントハンドラー
  const handleKeyDown = (e: React.KeyboardEvent, field: keyof YearlyData) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(field);
    }
  };

  // ソートアイコン
  const SortIcon = ({ field }: { field: keyof YearlyData }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">⇅</span>;
    }
    return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">詳細データテーブル</h2>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                onClick={() => handleSort('age')}
                onKeyDown={(e) => handleKeyDown(e, 'age')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                tabIndex={0}
                aria-sort={sortField === 'age' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                年齢 <SortIcon field="age" />
              </th>
              <th
                onClick={() => handleSort('amount')}
                onKeyDown={(e) => handleKeyDown(e, 'amount')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                tabIndex={0}
                aria-sort={sortField === 'amount' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                資産額（名目） <SortIcon field="amount" />
              </th>
              <th
                onClick={() => handleSort('inflationAdjusted')}
                onKeyDown={(e) => handleKeyDown(e, 'inflationAdjusted')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                tabIndex={0}
                aria-sort={sortField === 'inflationAdjusted' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                インフレ調整後価値（実質） <SortIcon field="inflationAdjusted" />
              </th>
              <th
                onClick={() => handleSort('realReturn')}
                onKeyDown={(e) => handleKeyDown(e, 'realReturn')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                tabIndex={0}
                aria-sort={sortField === 'realReturn' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                実質利回り累計 <SortIcon field="realReturn" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((data, index) => (
              <tr
                key={data.age}
                className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                  {data.age}歳
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {formatAmount(data.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {formatAmount(data.inflationAdjusted)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {data.realReturn.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {startIndex + 1}〜{Math.min(endIndex, sortedData.length)} / 全{sortedData.length}件
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
            aria-label="前のページへ移動"
          >
            前へ
          </button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
            aria-label="次のページへ移動"
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}
