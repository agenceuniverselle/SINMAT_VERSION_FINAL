import React from "react";
import { useTranslation } from "react-i18next";
import LegalLayout from "@/components/layouts/LegalLayout";

const sections = [
  "definition",
  "types",
  "finalites",
  "gestion",
  "consentement",
  "modifications",
  "contact",
] as const;

const PolitiqueDesCookiesPage: React.FC = () => {
  const { t } = useTranslation();

  const tableOfContents = sections.map((section) => ({
    id: section,
    title: t(`cookies.toc.${section}`),
  }));

  return (
    <LegalLayout
      title={t("cookies.title")}
      subtitle={t("cookies.subtitle")}
      tableOfContents={tableOfContents}
    >
      <div className="prose max-w-none">
        {sections.map((section) => {
          const title = t(`cookies.sections.${section}.title`);
          const content = t(`cookies.sections.${section}.content`, {
            returnObjects: true,
          });

          // ✅ Cas spécial pour "types" avec labels traduits dynamiquement
          if (section === "types" && Array.isArray(content)) {
            const labelKeys = ["technical", "performance", "functionality", "thirdparty"];
            return (
              <section id={section} className="mb-10" key={section}>
                <h2>{title}</h2>
                <ul className="list-disc pl-6 space-y-1">
                  {content.map((item: string, i: number) => {
                    const label = t(`cookies.sections.types.labels.${labelKeys[i]}`);
                    return (
                      <li key={i}>
                        <strong>{label}:</strong> {item}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          }

          return (
            <section id={section} className="mb-10" key={section}>
              <h2>{title}</h2>
              {Array.isArray(content) ? (
                <ul className="list-disc pl-6 space-y-1">
                  {content.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{String(content)}</p>
              )}
            </section>
          );
        })}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">{t("cookies.updated")}</p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default PolitiqueDesCookiesPage;
