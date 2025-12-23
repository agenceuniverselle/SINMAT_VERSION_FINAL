import React from "react";
import { useTranslation } from "react-i18next";
import LegalLayout from "@/components/layouts/LegalLayout";

const sections = [
  "introduction",
  "collecte",
  "utilisation",
  "partage",
  "securite",
  "duree",
  "droits",
  "contact",
] as const;

const PolitiqueDeConfidentialitePage = () => {
  const { t } = useTranslation();

  const tableOfContents = sections.map((section) => ({
    id: section,
    title: t(`privacy.toc.${section}`),
  }));

  return (
    <LegalLayout
      title={t("privacy.title")}
      subtitle={t("privacy.subtitle")}
      tableOfContents={tableOfContents}
    >
      <div className="prose max-w-none">
        {sections.map((section) => {
          const content = t(`privacy.sections.${section}.content`, {
            returnObjects: true,
          });

          return (
            <section id={section} className="mb-10" key={section}>
              <h2>{t(`privacy.sections.${section}.title`)}</h2>

              {Array.isArray(content) ? (
                <ul className="list-disc pl-6 space-y-1">
                  {content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p
                  dangerouslySetInnerHTML={{
                    __html: String(content),
                  }}
                />
              )}
            </section>
          );
        })}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {t("privacy.updated")}
          </p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default PolitiqueDeConfidentialitePage;
