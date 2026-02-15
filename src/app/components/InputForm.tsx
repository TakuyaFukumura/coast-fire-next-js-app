'use client';

import {CoastFireInput, DEFAULT_INPUT} from '@/types/coastFire';
import {useState} from 'react';

interface InputFormProps {
    onCalculate: (input: CoastFireInput) => void;
    defaultValues?: CoastFireInput;
}

export default function InputForm({onCalculate, defaultValues = DEFAULT_INPUT}: InputFormProps) {
    const [targetAmount, setTargetAmount] = useState(defaultValues.targetAmount);
    const [targetAge, setTargetAge] = useState(defaultValues.targetAge);
    const [currentAge, setCurrentAge] = useState(defaultValues.currentAge);
    const [returnRate, setReturnRate] = useState(defaultValues.returnRate * 100); // パーセント表示
    const [inflationRate, setInflationRate] = useState(defaultValues.inflationRate * 100); // パーセント表示

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate({
            targetAmount,
            targetAge,
            currentAge,
            returnRate: returnRate / 100,
            inflationRate: inflationRate / 100,
        });
    };

    const handleReset = () => {
        setTargetAmount(DEFAULT_INPUT.targetAmount);
        setTargetAge(DEFAULT_INPUT.targetAge);
        setCurrentAge(DEFAULT_INPUT.currentAge);
        setReturnRate(DEFAULT_INPUT.returnRate * 100);
        setInflationRate(DEFAULT_INPUT.inflationRate * 100);
        onCalculate(DEFAULT_INPUT);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">入力パラメータ</h2>

            {/* 目標資産額 */}
            <div className="space-y-2">
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    目標資産額（万円）
                </label>
                <input
                    type="number"
                    id="targetAmount"
                    value={isNaN(targetAmount) ? '' : targetAmount}
                    onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setTargetAmount(isNaN(value) ? 0 : value);
                    }}
                    min={100}
                    max={10000}
                    step={100}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                <input
                    type="range"
                    value={isNaN(targetAmount) ? 2000 : targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    min={100}
                    max={10000}
                    step={100}
                    className="w-full"
                    aria-label="目標資産額（万円）"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">範囲: 100万円〜1億円</p>
            </div>

            {/* 現在の年齢 */}
            <div className="space-y-2">
                <label htmlFor="currentAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    現在の年齢
                </label>
                <input
                    type="number"
                    id="currentAge"
                    value={isNaN(currentAge) ? '' : currentAge}
                    onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setCurrentAge(isNaN(value) ? 0 : value);
                    }}
                    min={0}
                    max={99}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">範囲: 0歳〜99歳</p>
            </div>

            {/* 目標達成年齢 */}
            <div className="space-y-2">
                <label htmlFor="targetAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    目標達成年齢
                </label>
                <input
                    type="number"
                    id="targetAge"
                    value={isNaN(targetAge) ? '' : targetAge}
                    onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setTargetAge(isNaN(value) ? 0 : value);
                    }}
                    min={1}
                    max={100}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                <input
                    type="range"
                    value={isNaN(targetAge) ? 65 : targetAge}
                    onChange={(e) => setTargetAge(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-full"
                    aria-label="目標達成年齢"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">範囲: 1歳〜100歳</p>
            </div>

            {/* 運用利回り */}
            <div className="space-y-2">
                <label htmlFor="returnRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    運用利回り（%）
                </label>
                <input
                    type="number"
                    id="returnRate"
                    value={isNaN(returnRate) ? '' : returnRate}
                    onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setReturnRate(isNaN(value) ? 0 : value);
                    }}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                <input
                    type="range"
                    value={isNaN(returnRate) ? 5 : returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full"
                    aria-label="運用利回り（%）"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">範囲: 0%〜10%</p>
            </div>

            {/* インフレ率 */}
            <div className="space-y-2">
                <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    インフレ率（%）
                </label>
                <input
                    type="number"
                    id="inflationRate"
                    value={isNaN(inflationRate) ? '' : inflationRate}
                    onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        setInflationRate(isNaN(value) ? 0 : value);
                    }}
                    min={0}
                    max={5}
                    step={0.1}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                <input
                    type="range"
                    value={isNaN(inflationRate) ? 2 : inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    min={0}
                    max={5}
                    step={0.1}
                    className="w-full"
                    aria-label="インフレ率（%）"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">範囲: 0%〜5%</p>
            </div>

            {/* ボタン */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    再計算
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    リセット
                </button>
            </div>
        </form>
    );
}
