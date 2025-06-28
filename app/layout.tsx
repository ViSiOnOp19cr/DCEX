import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Appbar } from "./components/AppBar";
import { Provider } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DCEX - Decentralized Exchange for India",
  description: "The simplest way to buy, sell, and swap cryptocurrency in India. Create a wallet with just your Google account.",
  keywords: "cryptocurrency, India, INR, Solana, USDC, USDT, exchange, wallet",
  authors: [{ name: "DCEX Team" }],
  openGraph: {
    title: "DCEX - Decentralized Exchange for India",
    description: "The simplest way to buy, sell, and swap cryptocurrency in India",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          <Appbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
