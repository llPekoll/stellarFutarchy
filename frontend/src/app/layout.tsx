import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { ConnectWallet } from "@/components/ConnectWallet";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stellar Futarchy",
  description: "Permissionless futarchy governance on Stellar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <WalletProvider>
          <nav className="border-b border-gray-800 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link
                  href="/"
                  className="text-lg font-bold text-white hover:text-indigo-400 transition-colors"
                >
                  Stellar Futarchy
                </Link>
                <div className="flex gap-4 text-sm text-gray-400">
                  <Link href="/" className="hover:text-white transition-colors">
                    Projects
                  </Link>
                  <Link
                    href="/register"
                    className="hover:text-white transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
              <ConnectWallet />
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
