/**
 * Coast FIRE計算ロジック
 *
 * このモジュールは、Coast FIRE（Coast Financial Independence, Retire Early）の
 * 計算を行います。目標資産額は現在価値ベースで入力され、インフレを考慮した
 * 実質価値での計算を行います。
 */

import {CoastFireInput, CoastFireResult, YearlyData} from '@/types/coastFire';

/**
 * Coast FIRE計算のメイン関数
 *
 * @param input - 計算に必要な入力パラメータ
 * @returns 計算結果
 *
 * @remarks
 * - 目標資産額は現在価値ベース（今の物価感での必要額）
 * - 実質利回りはフィッシャー方程式を使用して計算
 * - 目標年齢でのインフレ調整後価値が目標資産額と一致
 */
export function calculateCoastFire(input: CoastFireInput): CoastFireResult {
    // 入力値のバリデーション
    validateInput(input);

    const {targetAmount, targetAge, currentAge, returnRate, inflationRate} = input;

    // 運用年数を計算
    const investmentYears = targetAge - currentAge;

    // 実質利回りを計算（フィッシャー方程式）
    // 実質利回り = (1 + 運用利回り) / (1 + インフレ率) - 1
    const realReturnRate = (1 + returnRate) / (1 + inflationRate) - 1;

    // 現在必要な資産額を計算
    // 現在必要な資産額 = 目標資産額（現在価値） / (1 + 実質利回り)^運用年数
    const requiredAmount = targetAmount / Math.pow(1 + realReturnRate, investmentYears);

    // 目標年齢時点での名目資産額を計算
    const targetNominalAmount = requiredAmount * Math.pow(1 + returnRate, investmentYears);

    // 年齢ごとのデータを計算
    const yearlyData: YearlyData[] = [];
    for (let age = currentAge; age <= targetAge; age++) {
        const yearsElapsed = age - currentAge;

        // 各年の資産額（名目）
        const amount = requiredAmount * Math.pow(1 + returnRate, yearsElapsed);

        // インフレ調整後価値（実質）
        const inflationAdjusted = amount / Math.pow(1 + inflationRate, yearsElapsed);

        // 実質利回り累計（%）
        const realReturn = yearsElapsed === 0 ? 0 : ((inflationAdjusted / requiredAmount) - 1) * 100;

        yearlyData.push({
            age,
            amount,
            inflationAdjusted,
            realReturn,
        });
    }

    return {
        requiredAmount,
        yearlyData,
        realReturnRate,
        investmentYears,
        targetNominalAmount,
    };
}

/**
 * 入力値のバリデーション
 *
 * @param input - バリデーション対象の入力値
 * @throws {Error} バリデーションエラーの場合
 */
function validateInput(input: CoastFireInput): void {
    const {targetAmount, targetAge, currentAge, returnRate, inflationRate} = input;

    // 数値の妥当性チェック（NaN / Infinity を排除）
    if (!Number.isFinite(targetAmount)) {
        throw new Error('目標資産額には有限の数値を入力してください');
    }
    if (!Number.isFinite(currentAge)) {
        throw new Error('現在の年齢には有限の数値を入力してください');
    }
    if (!Number.isFinite(targetAge)) {
        throw new Error('目標達成年齢には有限の数値を入力してください');
    }
    if (!Number.isFinite(returnRate)) {
        throw new Error('運用利回りには有限の数値を入力してください');
    }
    if (!Number.isFinite(inflationRate)) {
        throw new Error('インフレ率には有限の数値を入力してください');
    }

    // 金額は正の値
    if (targetAmount <= 0) {
        throw new Error('目標資産額は正の値を入力してください');
    }

    // 目標資産額の範囲チェック（100万円〜10億円）
    if (targetAmount < 100 || targetAmount > 100000) {
        throw new Error('目標資産額は100万円から10億円の範囲で入力してください');
    }

    // 現在の年齢の範囲チェック（0歳〜99歳）
    if (currentAge < 0 || currentAge > 99) {
        throw new Error('現在の年齢は0歳から99歳の範囲で入力してください');
    }

    // 目標達成年齢は正の値
    if (targetAge < 0) {
        throw new Error('目標達成年齢は0以上の値を入力してください');
    }

    // 目標達成年齢 > 現在の年齢（先にこのチェックを行う）
    if (targetAge <= currentAge) {
        throw new Error('目標達成年齢は現在の年齢より大きい値を入力してください');
    }

    // 目標達成年齢の範囲チェック（30歳〜100歳）
    if (targetAge < 30 || targetAge > 100) {
        throw new Error('目標達成年齢は30歳から100歳の範囲で入力してください');
    }

    // 運用利回りの範囲チェック（0%〜20%）
    if (returnRate < 0 || returnRate > 0.2) {
        throw new Error('運用利回りは0%から20%の範囲で入力してください');
    }

    // インフレ率の範囲チェック（0%〜10%）
    if (inflationRate < 0 || inflationRate > 0.1) {
        throw new Error('インフレ率は0%から10%の範囲で入力してください');
    }
}

/**
 * 金額を万円単位でフォーマット
 *
 * @param amount - フォーマット対象の金額（万円）
 * @returns フォーマットされた文字列（例: "1,234万円"）
 */
export function formatAmount(amount: number): string {
    return `${Math.round(amount).toLocaleString('ja-JP')}万円`;
}

/**
 * パーセンテージをフォーマット
 *
 * @param rate - フォーマット対象の割合（小数、例: 0.05）
 * @param decimalPlaces - 小数点以下の桁数（デフォルト: 2）
 * @returns フォーマットされた文字列（例: "5.00%"）
 */
export function formatPercentage(rate: number, decimalPlaces = 2): string {
    return `${(rate * 100).toFixed(decimalPlaces)}%`;
}
