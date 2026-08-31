import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import AssetTable from '../../../../src/app/components/AssetTable';
import {YearlyData} from '@/types/coastFire';

const createYearlyData = (length: number): YearlyData[] =>
    Array.from({length}, (_, index) => ({
        age: 28 + index,
        amount: 1000 + index,
        inflationAdjusted: 900 + index,
        realReturn: index,
    }));

describe('AssetTable', () => {
    it('条件変更でページ番号を1ページ目にリセットする', () => {
        const initialData = createYearlyData(38);
        const {rerender} = render(<AssetTable key={JSON.stringify(initialData)} yearlyData={initialData}/>);

        fireEvent.click(screen.getByRole('button', {name: '次のページへ移動'}));
        fireEvent.click(screen.getByRole('button', {name: '次のページへ移動'}));
        fireEvent.click(screen.getByRole('button', {name: '次のページへ移動'}));
        expect(screen.getByText('4 / 4')).toBeInTheDocument();

        const updatedData = createYearlyData(11);
        rerender(<AssetTable key={JSON.stringify(updatedData)} yearlyData={updatedData}/>);

        expect(screen.getByText('1〜10 / 全11件')).toBeInTheDocument();
        expect(screen.getByText('1 / 2')).toBeInTheDocument();
        expect(screen.getByText('28歳')).toBeInTheDocument();
    });
});
