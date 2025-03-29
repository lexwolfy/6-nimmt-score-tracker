import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "6 Nimmt! Score Tracker",
  description: "Track scores and sessions for the card game 6 Nimmt!",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
