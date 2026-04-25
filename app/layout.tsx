import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FeedbackForge",
  description: "AI feedback coaching for managers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${inter.className} antialiased min-h-[100dvh] bg-gradient-to-br from-slate-50 to-blue-50/30 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
