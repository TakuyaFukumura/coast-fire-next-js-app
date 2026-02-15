import type {Metadata} from "next";
import "./globals.css";
import {DarkModeProvider} from "./components/DarkModeProvider";
import Header from "./components/Header";
import React from "react";

export const metadata: Metadata = {
    title: "Coast FIRE計算機",
    description: "Coast FIRE計算機 - 老後の目標資産額達成に必要な現在資産額を算出",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
        <body className="antialiased">
        <DarkModeProvider>
            <Header/>
            {children}
        </DarkModeProvider>
        </body>
        </html>
    );
}
