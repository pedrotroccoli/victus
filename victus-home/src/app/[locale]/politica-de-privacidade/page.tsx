"use client";

import { Grid } from "@/components/grid";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("privacy");

  return (
    <main className="bg-[#f7f7f7]">
      <section className="w-full h-20">
        <Grid />
      </section>

      <Grid className="py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-victus-black mb-2">
            {t("title")}
          </h1>
          <p className="text-neutral-500 mb-8">{t("last_updated")}</p>

          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-700 mb-8">{t("intro")}</p>

            <section className="mb-8">
              <h2 className="text-xl font-display font-semibold text-victus-black mb-4">
                {t("section_1_title")}
              </h2>
              <p className="text-neutral-700 mb-4">{t("section_1_content")}</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>{t("section_1_items.item_1")}</li>
                <li>{t("section_1_items.item_2")}</li>
                <li>{t("section_1_items.item_3")}</li>
                <li>{t("section_1_items.item_4")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-display font-semibold text-victus-black mb-4">
                {t("section_2_title")}
              </h2>
              <p className="text-neutral-700 mb-4">{t("section_2_content")}</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>{t("section_2_items.item_1")}</li>
                <li>{t("section_2_items.item_2")}</li>
                <li>{t("section_2_items.item_3")}</li>
                <li>{t("section_2_items.item_4")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-display font-semibold text-victus-black mb-4">
                {t("section_3_title")}
              </h2>
              <p className="text-neutral-700">{t("section_3_content")}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-display font-semibold text-victus-black mb-4">
                {t("section_4_title")}
              </h2>
              <p className="text-neutral-700 mb-4">{t("section_4_content")}</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>{t("section_4_items.item_1")}</li>
                <li>{t("section_4_items.item_2")}</li>
                <li>{t("section_4_items.item_3")}</li>
                <li>{t("section_4_items.item_4")}</li>
                <li>{t("section_4_items.item_5")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-display font-semibold text-victus-black mb-4">
                {t("section_5_title")}
              </h2>
              <p className="text-neutral-700">{t("section_5_content")}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-display font-semibold text-victus-black mb-4">
                {t("section_6_title")}
              </h2>
              <p className="text-neutral-700">{t("section_6_content")}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-display font-semibold text-victus-black mb-4">
                {t("section_7_title")}
              </h2>
              <p className="text-neutral-700 mb-4">{t("section_7_content")}</p>
              <p className="text-neutral-700 font-medium">
                {t("contact_email")}
              </p>
            </section>
          </div>
        </div>
      </Grid>

      <section className="w-full h-20">
        <Grid />
      </section>
    </main>
  );
}
