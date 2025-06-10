import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Navigation/Header";
import Footer from "../components/Navigation/Footer";

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
        <Header />
        
        <main className="main-content flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
