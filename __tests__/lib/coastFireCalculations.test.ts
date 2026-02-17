/**
 * Coast FIRE計算ロジックのテスト
 */

import {calculateCoastFire, formatAmount, formatPercentage} from '../../lib/coastFireCalculations';
import {CoastFireInput} from '@/types/coastFire';

describe('Coast FIRE Calculations', () => {
    describe('calculateCoastFire', () => {
        it('基本的な計算が正しく行われる', () => {
            const input: CoastFireInput = {
                targetAmount: 2000, // 2000万円
                targetAge: 65,
                currentAge: 28,
                returnRate: 0.05, // 5%
                inflationRate: 0.02, // 2%
            };

            const result = calculateCoastFire(input);

            // 運用年数の確認
            expect(result.investmentYears).toBe(37);

            // 実質利回りの確認
            // (1.05 / 1.02 - 1) ≈ 0.0294
            expect(result.realReturnRate).toBeCloseTo(0.0294, 4);

            // 現在必要な資産額が正しく計算されているか
            // 2000 / (1.0294)^37 ≈ 690万円程度
            expect(result.requiredAmount).toBeGreaterThan(600);
            expect(result.requiredAmount).toBeLessThan(800);

            // 年齢ごとのデータ配列が正しい長さか
            expect(result.yearlyData).toHaveLength(38); // 28歳から65歳まで（両端含む）

            // 最初の年（現在）のデータ確認
            expect(result.yearlyData[0].age).toBe(28);
            expect(result.yearlyData[0].amount).toBeCloseTo(result.requiredAmount, 2);
            expect(result.yearlyData[0].inflationAdjusted).toBeCloseTo(result.requiredAmount, 2);
            expect(result.yearlyData[0].realReturn).toBe(0);

            // 最後の年（目標年齢）のデータ確認
            const lastYear = result.yearlyData[result.yearlyData.length - 1];
            expect(lastYear.age).toBe(65);
            // 目標年齢でのインフレ調整後価値が目標額と一致する
            expect(lastYear.inflationAdjusted).toBeCloseTo(2000, 0);
        });

        it('インフレ率が0の場合も正しく計算される', () => {
            const input: CoastFireInput = {
                targetAmount: 2000,
                targetAge: 65,
                currentAge: 28,
                returnRate: 0.05,
                inflationRate: 0, // インフレ率0%
            };

            const result = calculateCoastFire(input);

            // インフレ率0の場合、実質利回り = 運用利回り
            expect(result.realReturnRate).toBeCloseTo(0.05, 4);

            // 名目額 = 実質価値
            result.yearlyData.forEach((data) => {
                expect(data.amount).toBeCloseTo(data.inflationAdjusted, 2);
            });
        });

        it('運用利回りとインフレ率が同じ場合、実質利回りは0になる', () => {
            const input: CoastFireInput = {
                targetAmount: 2000,
                targetAge: 65,
                currentAge: 28,
                returnRate: 0.03,
                inflationRate: 0.03, // 同じ率
            };

            const result = calculateCoastFire(input);

            // 実質利回りが0
            expect(result.realReturnRate).toBeCloseTo(0, 4);

            // 現在必要な資産額 = 目標資産額
            expect(result.requiredAmount).toBeCloseTo(2000, 2);
        });

        it('短期間の計算も正しく行われる', () => {
            const input: CoastFireInput = {
                targetAmount: 1000,
                targetAge: 35,
                currentAge: 30,
                returnRate: 0.05,
                inflationRate: 0.02,
            };

            const result = calculateCoastFire(input);

            expect(result.investmentYears).toBe(5);
            expect(result.yearlyData).toHaveLength(6); // 30歳から35歳まで
        });

        it('異なるパラメータで計算結果が変わる', () => {
            const input1: CoastFireInput = {
                targetAmount: 2000,
                targetAge: 65,
                currentAge: 28,
                returnRate: 0.05,
                inflationRate: 0.02,
            };

            const input2: CoastFireInput = {
                ...input1,
                returnRate: 0.07, // 運用利回りを上げる
            };

            const result1 = calculateCoastFire(input1);
            const result2 = calculateCoastFire(input2);

            // 運用利回りが高いほど、現在必要な資産額は少なくなる
            expect(result2.requiredAmount).toBeLessThan(result1.requiredAmount);
        });

        describe('バリデーション', () => {
            it('目標資産額が0以下の場合エラー', () => {
                const input: CoastFireInput = {
                    targetAmount: 0,
                    targetAge: 65,
                    currentAge: 28,
                    returnRate: 0.05,
                    inflationRate: 0.02,
                };

                expect(() => calculateCoastFire(input)).toThrow('目標資産額は正の値を入力してください');
            });

            it('目標資産額が範囲外の場合エラー', () => {
                const input: CoastFireInput = {
                    targetAmount: 50, // 100万円未満
                    targetAge: 65,
                    currentAge: 28,
                    returnRate: 0.05,
                    inflationRate: 0.02,
                };

                expect(() => calculateCoastFire(input)).toThrow('目標資産額は100万円から1億円の範囲で入力してください');
            });

            it('目標達成年齢が現在の年齢以下の場合エラー', () => {
                const input: CoastFireInput = {
                    targetAmount: 2000,
                    targetAge: 28,
                    currentAge: 28,
                    returnRate: 0.05,
                    inflationRate: 0.02,
                };

                expect(() => calculateCoastFire(input)).toThrow('目標達成年齢は現在の年齢より大きい値を入力してください');
            });

            it('年齢が負の値の場合エラー', () => {
                const input: CoastFireInput = {
                    targetAmount: 2000,
                    targetAge: 65,
                    currentAge: -1,
                    returnRate: 0.05,
                    inflationRate: 0.02,
                };

                expect(() => calculateCoastFire(input)).toThrow('現在の年齢は0歳から99歳の範囲で入力してください');
            });

            it('現在の年齢が範囲外の場合エラー', () => {
                const input: CoastFireInput = {
                    targetAmount: 2000,
                    targetAge: 65,
                    currentAge: 100, // 99歳を超える
                    returnRate: 0.05,
                    inflationRate: 0.02,
                };

                expect(() => calculateCoastFire(input)).toThrow('現在の年齢は0歳から99歳の範囲で入力してください');
            });

            it('目標達成年齢が範囲外の場合エラー', () => {
                const input: CoastFireInput = {
                    targetAmount: 2000,
                    targetAge: 0, // 1歳未満
                    currentAge: 20,
                    returnRate: 0.05,
                    inflationRate: 0.02,
                };

                expect(() => calculateCoastFire(input)).toThrow('目標達成年齢は1歳から100歳の範囲で入力してください');
            });

            it('運用利回りが負の値の場合エラー', () => {
                const input: CoastFireInput = {
                    targetAmount: 2000,
                    targetAge: 65,
                    currentAge: 28,
                    returnRate: -0.05,
                    inflationRate: 0.02,
                };

                expect(() => calculateCoastFire(input)).toThrow('運用利回りは0%から10%の範囲で入力してください');
            });

            it('運用利回りが範囲外の場合エラー', () => {
                const input: CoastFireInput = {
                    targetAmount: 2000,
                    targetAge: 65,
                    currentAge: 28,
                    returnRate: 0.25, // 20%を超える
                    inflationRate: 0.02,
                };

                expect(() => calculateCoastFire(input)).toThrow('運用利回りは0%から10%の範囲で入力してください');
            });

            it('インフレ率が範囲外の場合エラー', () => {
                const input: CoastFireInput = {
                    targetAmount: 2000,
                    targetAge: 65,
                    currentAge: 28,
                    returnRate: 0.05,
                    inflationRate: 0.15, // 10%を超える
                };

                expect(() => calculateCoastFire(input)).toThrow('インフレ率は0%から5%の範囲で入力してください');
            });
        });
    });

    describe('formatAmount', () => {
        it('金額を正しくフォーマットする', () => {
            expect(formatAmount(1234)).toBe('1,234万円');
            expect(formatAmount(812)).toBe('812万円');
            expect(formatAmount(2000)).toBe('2,000万円');
        });

        it('小数点以下は四捨五入される', () => {
            expect(formatAmount(1234.5)).toBe('1,235万円');
            expect(formatAmount(1234.4)).toBe('1,234万円');
        });
    });

    describe('formatPercentage', () => {
        it('パーセンテージを正しくフォーマットする', () => {
            expect(formatPercentage(0.05)).toBe('5.00%');
            expect(formatPercentage(0.02)).toBe('2.00%');
            expect(formatPercentage(0.0294)).toBe('2.94%');
        });

        it('小数点以下の桁数を指定できる', () => {
            expect(formatPercentage(0.05, 0)).toBe('5%');
            expect(formatPercentage(0.05, 1)).toBe('5.0%');
            expect(formatPercentage(0.05, 3)).toBe('5.000%');
        });
    });
});
