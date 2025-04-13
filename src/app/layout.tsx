import type { Metadata } from "next";

import './globals.css';

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
        {children}
      </body>
    </html>
  );
}
