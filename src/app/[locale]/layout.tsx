import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { InterFont, RecursiveFont } from "../_fonts";

import { News } from "@/components/news";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import '../globals.css';

export const metadata: Metadata = {
  title: "Jornal Victus",
  description:
    "Victus é um bullet journal que ajuda você a organizar seu dia a dia.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
    // Ensure that the incoming `locale` is valid
    const {locale} = await params;

    if (!hasLocale(routing.locales, locale)) {
      notFound();
    }

  return (
    <html lang={locale}>
      <body className={`${InterFont.variable} ${RecursiveFont.variable}`}>
        <NextIntlClientProvider>
          <Header locale={locale} />

          {children}

          <News />

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
