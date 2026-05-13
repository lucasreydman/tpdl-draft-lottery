import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Nav from "@/components/shared/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className={`min-h-full flex flex-col ${inter.className}`}>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
