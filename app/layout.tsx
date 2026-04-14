import type { Metadata } from "next";
import { DM_Sans, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/src/styles/design-system.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Claude Code Mastery — Interactive Training Platform",
  description: "Master Claude Code with 20 interactive lessons based on Boris Cherny's techniques. Learn parallel execution, plan mode, verification loops, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${lora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          backgroundColor: 'var(--color-cream)',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-body)',
        }}
      >
        {children}
      </body>
    </html>
  );
}
