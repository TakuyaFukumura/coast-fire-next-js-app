/**
 * Header コンポーネントのテスト
 *
 * このテストファイルは、src/app/components/Header.tsxの機能をテストします。
 * ダークモード/ライトモードの切り替えボタンとヘッダーの表示をテストしています。
 */

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {DarkModeProvider} from '@/app/components/DarkModeProvider';
import Header from '../../../../src/app/components/Header';
import '@testing-library/jest-dom';

// usePathname をモック
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/'),
}));

describe('Header', () => {
    const renderWithProvider = (initialTheme?: 'light' | 'dark') => {
        if (initialTheme) {
            window.localStorage.getItem = jest.fn(() => initialTheme);
        }

        return render(
            <DarkModeProvider>
                <Header/>
            </DarkModeProvider>
        );
    };

    describe('基本的なレンダリング', () => {
        it('ヘッダータイトルが表示される', () => {
            renderWithProvider();

            expect(screen.getByText('coast-fire-next-js-app')).toBeInTheDocument();
        });

        it('ヘッダーのHTML構造が正しい', () => {
            renderWithProvider();

            const header = screen.getByRole('banner');
            expect(header).toBeInTheDocument();
            expect(header.tagName).toBe('HEADER');
        });

        it('テーマ切り替えボタンが表示される', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: /ライトモード|ダークモード/});
            expect(button).toBeInTheDocument();
        });
    });

    describe('ライトモード', () => {
        it('ライトモード時に太陽アイコンが表示される', () => {
            renderWithProvider('light');

            expect(screen.getByText('☀️')).toBeInTheDocument();
        });

        it('ライトモード時のラベルが表示される', () => {
            renderWithProvider('light');

            expect(screen.getByText('ライトモード')).toBeInTheDocument();
        });

        it('ボタンのtitle属性が正しく設定される', () => {
            renderWithProvider('light');

            const button = screen.getByRole('button', {name: /ライトモード/});
            expect(button).toHaveAttribute('title', '現在: ライトモード');
        });
    });

    describe('ダークモード', () => {
        it('ダークモード時に月アイコンが表示される', () => {
            window.localStorage.setItem('theme', 'dark');
            renderWithProvider();

            expect(screen.getByText('🌙')).toBeInTheDocument();
        });

        it('ダークモード時のラベルが表示される', () => {
            window.localStorage.setItem('theme', 'dark');
            renderWithProvider();

            expect(screen.getByText('ダークモード')).toBeInTheDocument();
        });

        it('ボタンのtitle属性が正しく設定される', () => {
            renderWithProvider('dark');

            const button = screen.getByRole('button', {name: /ダークモード/});
            expect(button).toHaveAttribute('title', '現在: ダークモード');
        });
    });

    describe('テーマ切り替え機能', () => {
        it('ライトモードからダークモードに切り替わる', () => {
            window.localStorage.setItem('theme', 'light');
            renderWithProvider();

            // 初期状態の確認
            expect(screen.getByText('☀️')).toBeInTheDocument();
            expect(screen.getByText('ライトモード')).toBeInTheDocument();

            // ボタンをクリック
            const button = screen.getByRole('button', {name: /ライトモード/});
            fireEvent.click(button);

            // ダークモードに変更されたことを確認
            expect(screen.getByText('🌙')).toBeInTheDocument();
            expect(screen.getByText('ダークモード')).toBeInTheDocument();
        });

        it('ダークモードからライトモードに切り替わる', () => {
            renderWithProvider('dark');

            // 初期状態の確認
            expect(screen.getByText('🌙')).toBeInTheDocument();
            expect(screen.getByText('ダークモード')).toBeInTheDocument();

            // ボタンをクリック
            const button = screen.getByRole('button', {name: /ダークモード/});
            fireEvent.click(button);

            // ライトモードに変更されたことを確認
            expect(screen.getByText('☀️')).toBeInTheDocument();
            expect(screen.getByText('ライトモード')).toBeInTheDocument();
        });

        it('複数回のクリックで正しく切り替わる', () => {
            renderWithProvider('light');

            let button = screen.getByRole('button', {name: /ライトモード/});

            // ライトモード → ダークモード
            fireEvent.click(button);
            expect(screen.getByText('🌙')).toBeInTheDocument();

            // ダークモード → ライトモード
            button = screen.getByRole('button', {name: /ダークモード/});
            fireEvent.click(button);
            expect(screen.getByText('☀️')).toBeInTheDocument();

            // ライトモード → ダークモード
            button = screen.getByRole('button', {name: /ライトモード/});
            fireEvent.click(button);
            expect(screen.getByText('🌙')).toBeInTheDocument();
        });
    });

    describe('ボタンのアクセシビリティ', () => {
        it('ボタンがキーボードでアクセス可能', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: /ライトモード|ダークモード/});
            expect(button).toBeInTheDocument();

            // タブキーでフォーカス可能かを確認
            button.focus();
            expect(button).toHaveFocus();
        });

        it('適切なaria属性が設定されている', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: /ライトモード|ダークモード/});

            // title属性による説明があることを確認
            expect(button).toHaveAttribute('title');
            expect(button.getAttribute('title')).toContain('現在:');
        });
    });

    describe('レスポンシブデザイン', () => {
        beforeEach(() => {
            window.localStorage.setItem('theme', 'light');
            renderWithProvider();
        });

        it('テキストラベルが適切なクラスで制御されている', () => {
            // 'hidden sm:inline' クラスでモバイルでは非表示になることを想定
            const textLabel = screen.getByText('ライトモード');
            expect(textLabel).toHaveClass('hidden', 'sm:inline');
        });

        it('アイコンが常に表示される', () => {

            const icon = screen.getByText('☀️');
            expect(icon).toBeInTheDocument();
        });
    });

    describe('CSS クラスの適用', () => {
        it('ヘッダーに適切なスタイルクラスが適用される', () => {
            renderWithProvider();

            const header = screen.getByRole('banner');
            expect(header).toHaveClass('bg-white/80', 'dark:bg-gray-800/80');
        });

        it('ボタンに適切なスタイルクラスが適用される', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: /ライトモード|ダークモード/});
            expect(button).toHaveClass('flex', 'items-center', 'gap-2');
        });
    });

    describe('ナビゲーション機能', () => {
        it('ナビゲーションリンクが表示される', () => {
            renderWithProvider();

            expect(screen.getByRole('link', {name: 'ホーム'})).toBeInTheDocument();
            expect(screen.getByRole('link', {name: 'Coast FIRE 計算機'})).toBeInTheDocument();
        });

        it('アクティブなリンクにaria-current="page"が設定される', () => {
            renderWithProvider();

            const homeLink = screen.getByRole('link', {name: 'ホーム'});
            expect(homeLink).toHaveAttribute('aria-current', 'page');
        });

        it('モバイルメニューボタンが表示される', () => {
            renderWithProvider();

            const menuButton = screen.getByRole('button', {name: 'メニューを開く'});
            expect(menuButton).toBeInTheDocument();
            expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        });

        it('モバイルメニューをクリックすると開閉する', () => {
            renderWithProvider();

            const menuButton = screen.getByRole('button', {name: 'メニューを開く'});
            
            // メニューを開く
            fireEvent.click(menuButton);
            
            // メニューが開いていることを確認
            const updatedButton = screen.getByRole('button', {name: 'メニューを閉じる'});
            expect(updatedButton).toHaveAttribute('aria-expanded', 'true');
            expect(updatedButton).toHaveAttribute('aria-controls', 'mobile-menu');
            
            // ナビゲーションリンクが表示されることを確認
            const mobileNav = screen.getAllByRole('navigation').find(nav => nav.id === 'mobile-menu');
            expect(mobileNav).toBeInTheDocument();
        });

        it('モバイルメニュー内のリンクをクリックするとメニューが閉じる', () => {
            renderWithProvider();

            // メニューを開く
            const menuButton = screen.getByRole('button', {name: 'メニューを開く'});
            fireEvent.click(menuButton);
            
            // メニュー内のリンクをクリック
            const links = screen.getAllByRole('link', {name: 'ホーム'});
            const mobileLink = links.find(link => link.closest('#mobile-menu'));
            if (mobileLink) {
                fireEvent.click(mobileLink);
            }
            
            // メニューが閉じていることを確認
            const closedButton = screen.getByRole('button', {name: 'メニューを開く'});
            expect(closedButton).toHaveAttribute('aria-expanded', 'false');
        });
    });
});
