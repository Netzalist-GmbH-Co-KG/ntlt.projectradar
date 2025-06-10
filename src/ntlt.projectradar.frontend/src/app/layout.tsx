import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Radar",
  description: "AI-powered project acquisition system for systematic lead management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="app-layout bg-neutral-50 text-neutral-900 antialiased">
        {/* Header Placeholder */}
        <header className="h-16 bg-white border-b border-neutral-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-primary-600">
                📡 Project Radar
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content flex-1">
          {children}
        </main>

        {/* Footer Placeholder */}
        <footer className="h-12 bg-neutral-100 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
            <p className="text-sm text-neutral-500">
              Project Radar v0.1.0 © 2025
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
