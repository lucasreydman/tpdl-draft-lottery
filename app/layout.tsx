import type { Metadata } from "next";
import { Big_Shoulders_Display, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/shared/Nav";
import "./globals.css";

const bigShoulders = Big_Shoulders_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "800", "900"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "TPDL Draft Lottery",
  description: "The People's Dynasty League Draft Lottery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
