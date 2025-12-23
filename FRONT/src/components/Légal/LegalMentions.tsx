import React from "react";
import { useTranslation } from "react-i18next";
import LegalLayout from "@/components/layouts/LegalLayout";

const MentionsLegalesPage = () => {
  const { t, i18n } = useTranslation();

  const tableOfContents = [
    { id: "editeur", title: t("legal.sections.editeur") },
    { id: "hebergement", title: t("legal.sections.hebergement") },
    { id: "propriete", title: t("legal.sections.propriete") },
    { id: "donnees", title: t("legal.sections.donnees") },
    { id: "responsabilite", title: t("legal.sections.responsabilite") },
    { id: "liens", title: t("legal.sections.liens") },
    { id: "cookies", title: t("legal.sections.cookies") },
    { id: "modification", title: t("legal.sections.modification") }
  ];

  return (
    <LegalLayout
      title={t("legal.title")}
      subtitle={t("legal.subtitle")}
      tableOfContents={tableOfContents}
    >
      <div className="prose max-w-none text-black dark:text-black" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <section id="editeur" className="mb-10">
          <h2>{t("legal.sections.editeur", { count: 1 })}</h2>
          <p>{t("legal.content.editeur.description")}</p>
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <p><strong>SINMAT</strong></p>
            <p>{t("legal.content.editeur.legalForm")}</p>
            <p>{t("legal.content.editeur.capital")}</p>
            <p>{t("legal.content.editeur.address")}</p>
            <p>{t("legal.content.editeur.ice")}</p>
            <p>{t("legal.content.editeur.phone")}</p>
            <p>{t("legal.content.editeur.email")}</p>
          </div>
          <p className="mt-4">{t("legal.content.editeur.director")}</p>
        </section>

        <section id="hebergement" className="mb-10">
          <h2>{t("legal.sections.hebergement")}</h2>
          <p>{t("legal.content.hebergement.description")}</p>
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <p><strong>DigitalOcean</strong></p>
            <p>{t("legal.content.hebergement.form")}</p>
            <p>
              {t("legal.content.hebergement.website")}{" "}
              <a
                href="https://www.digitalocean.com/"
                className="text-primary text-[#EF7A43] dark:text-[#FFA657] hover:underline"
              >
                https://www.digitalocean.com/
              </a>
            </p>
          </div>
        </section>

        <section id="propriete" className="mb-10">
          <h2>{t("legal.sections.propriete")}</h2>
          <p>{t("legal.content.propriete.text1")}</p>
          <p>{t("legal.content.propriete.text2")}</p>
        </section>

        <section id="donnees" className="mb-10">
          <h2>{t("legal.sections.donnees")}</h2>
          <p>
            {t("legal.content.donnees.text")}{" "}
            <a
              href="/politique-de-confidentialite"
              className="text-primary text-[#EF7A43] dark:text-[#FFA657] hover:underline"
            >
              {t("legal.content.donnees.link")}
            </a>.
          </p>
        </section>

        <section id="responsabilite" className="mb-10">
          <h2>{t("legal.sections.responsabilite")}</h2>
          <p>{t("legal.content.responsabilite.intro")}</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>{t("legal.content.responsabilite.point1")}</li>
            <li>{t("legal.content.responsabilite.point2")}</li>
            <li>{t("legal.content.responsabilite.point3")}</li>
          </ul>
        </section>

        <section id="liens" className="mb-10">
          <h2>{t("legal.sections.liens")}</h2>
          <p>{t("legal.content.liens.text")}</p>
        </section>

        <section id="cookies" className="mb-10">
          <h2>{t("legal.sections.cookies")}</h2>
          <p>
            {t("legal.content.cookies.text")}{" "}
            <a
              href="/politique-des-cookies"
              className="text-primary text-[#EF7A43] dark:text-[#FFA657] hover:underline"
            >
              {t("legal.content.cookies.link")}
            </a>.
          </p>
        </section>

        <section id="modification" className="mb-10">
          <h2>{t("legal.sections.modification")}</h2>
          <p>{t("legal.content.modification.text")}</p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {t("legal.contact.text")}{" "}
            <a
              href="mailto:contact@sinmat.ma"
              className="text-[#EF7A43] dark:text-[#FFA657] underline hover:opacity-90"
            >
              contact@sinmat.ma
            </a>
          </p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default MentionsLegalesPage;
