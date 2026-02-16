import {Metadata} from 'next';
import CoastFireCalculator from './components/CoastFireCalculator';

export const metadata: Metadata = {
    title: 'Coast FIRE 計算機 | Coast FIRE Next.js App',
    description: '老後の目標資産額を達成するために現時点で必要な資産額を計算するCoast FIRE計算機',
};

export default function Home() {
    return <CoastFireCalculator/>;
}

