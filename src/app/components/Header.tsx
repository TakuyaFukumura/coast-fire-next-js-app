'use client';

import {useDarkMode} from './DarkModeProvider';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';

export default function Header() {
    const {theme, setTheme} = useDarkMode();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleThemeToggle = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    const getThemeIcon = () => {
        if (theme === 'light') {
            return '☀️';
        } else {
            return '🌙';
        }
    };

    const getThemeLabel = () => {
        if (theme === 'light') {
            return 'ライトモード';
        } else {
            return 'ダークモード';
        }
    };

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        {href: '/', label: 'ホーム'},
        {href: '/coast-fire', label: 'Coast FIRE 計算機'},
    ];

    return (
        <header
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b
            border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/"
                              className="text-xl font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            coast-fire-next-js-app
                        </Link>
                        {/* デスクトップナビゲーション */}
                        <nav className="hidden sm:flex items-center gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors ${
                                        isActive(link.href)
                                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`}
                                    aria-current={isActive(link.href) ? 'page' : undefined}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* モバイルメニューボタン */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="sm:hidden flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label={mobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                )}
                            </svg>
                        </button>

                        <button
                            onClick={handleThemeToggle}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium
                            text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                            rounded-lg transition-colors duration-200"
                            title={`現在: ${getThemeLabel()}`}
                        >
                            <span className="text-lg">{getThemeIcon()}</span>
                            <span className="hidden sm:inline">{getThemeLabel()}</span>
                        </button>
                    </div>
                </div>

                {/* モバイルメニュー */}
                {mobileMenuOpen && (
                    <nav id="mobile-menu" className="sm:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-2 text-sm font-medium transition-colors ${
                                    isActive(link.href)
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                aria-current={isActive(link.href) ? 'page' : undefined}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
