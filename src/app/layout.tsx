import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LexFlow | AI-Powered Legal Client Intake & Case Communication",
  description: "Automate client intake, case tracking, and legal communication for your law firm with LexFlow AI.",
  icons: {
    icon: "/icon.png",
  },
};

import { IntakeBot } from "@/components/ui/intake-bot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        {children}
        <IntakeBot />
      </body>
    </html>
  );
}
