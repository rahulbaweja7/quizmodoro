import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800`}>

        {/* Modern App Bar */}
        <nav className="sticky top-0 z-30 bg-white dark:bg-gray-900 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* App Name */}
            <a href="/" className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight hover:opacity-80 transition">Quizmodoro</a>
            {/* Navigation Links */}
            <div className="flex gap-6">
              <a href="/" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition">Home</a>
              <a href="/history" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition">History</a>
            </div>
            {/* User Info (placeholder) */}
            <div className="flex items-center gap-2">
              <img src="/default-avatar.svg" alt="Profile" className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Demo User</span>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
