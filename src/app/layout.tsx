import type { Metadata } from "next";

import './globals.css';

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { News } from "@/components/news";
import { InterFont, RecursiveFont } from "./_fonts";

export const metadata: Metadata = {
  title: "Jornal Victus",
  description:
    "Victus é um bullet journal que ajuda você a organizar seu dia a dia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${InterFont.variable} ${RecursiveFont.variable}`}>
        <Header />

        {children}

        <News />

        <Footer />
      </body>
    </html>
  );
}
