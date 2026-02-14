/**
 * Coast FIRE計算機の型定義
 */

/**
 * Coast FIRE計算の入力パラメータ
 */
export interface CoastFireInput {
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

/**
 * 年齢ごとの資産データ
 */
export interface YearlyData {
    /** 年齢 */
    age: number;
    /** 資産額（名目、万円） */
    amount: number;
    /** インフレ調整後価値（実質、万円） */
    inflationAdjusted: number;
    /** 実質利回り累計（%） - 開始時点からの累積実質リターン */
    realReturn: number;
}

/**
 * Coast FIRE計算の結果
 */
export interface CoastFireResult {
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

/**
 * デフォルトの入力値
 */
export const DEFAULT_INPUT: CoastFireInput = {
    targetAmount: 2000, // 2000万円
    targetAge: 65,
    currentAge: 28,
    returnRate: 0.05, // 5%
    inflationRate: 0.02, // 2%
};

