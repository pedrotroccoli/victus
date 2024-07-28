import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";import { Auth0Provider } from "@/providers/auth0";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Auth0Provider
        >
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
