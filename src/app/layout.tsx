import * as React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Apprentice (UK) Bingo",
  description: "A bingo game for The Apprentice UK TV show",
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#111827" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
} 