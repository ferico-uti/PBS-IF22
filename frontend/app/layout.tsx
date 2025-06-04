import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="emerald">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* area header */}
        <header className="ml-10 mt-5">
          <Image
            src={"/images/logo.png"}
            width={320}
            height={60}
            alt="Logo UTI"
            priority></Image>
        </header>

        {/* area content */}
        <section className="m-10">{children}</section>

        {/* area footer */}
        <footer className="text-center mx-10 my-10">
          &copy; {process.env.NEXT_PUBLIC_FOOTER_TEXT}
        </footer>
      </body>
    </html>
  );
}
