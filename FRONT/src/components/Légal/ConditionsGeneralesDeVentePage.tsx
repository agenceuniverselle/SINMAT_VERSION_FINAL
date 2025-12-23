import React from "react";
import { useTranslation } from "react-i18next";
import LegalLayout from "@/components/layouts/LegalLayout";

const ConditionsGeneralesDeVentePage = () => {
  const { t } = useTranslation();

  const tableOfContents = [
    { id: "objet", title: t("cgv.toc.objet") },
    { id: "produits", title: t("cgv.toc.produits") },
    { id: "commande", title: t("cgv.toc.commande") },
    { id: "prix", title: t("cgv.toc.prix") },
    { id: "paiement", title: t("cgv.toc.paiement") },
    { id: "livraison", title: t("cgv.toc.livraison") },
    { id: "retours", title: t("cgv.toc.retours") },
    { id: "responsabilite", title: t("cgv.toc.responsabilite") },
    { id: "donnees", title: t("cgv.toc.donnees") },
    { id: "droit", title: t("cgv.toc.droit") },
  ];

  return (
    <LegalLayout
      title={t("cgv.title")}
      subtitle={t("cgv.subtitle")}
      tableOfContents={tableOfContents}
    >
      <div className="prose max-w-none">
        <section id="objet" className="mb-10">
          <h2>{t("cgv.sections.objet.title")}</h2>
          <p>{t("cgv.sections.objet.content")}</p>
        </section>

        <section id="produits" className="mb-10">
          <h2>{t("cgv.sections.produits.title")}</h2>
          <p>{t("cgv.sections.produits.content")}</p>
        </section>

        <section id="commande" className="mb-10">
          <h2>{t("cgv.sections.commande.title")}</h2>
          <p>{t("cgv.sections.commande.content")}</p>
        </section>

        <section id="prix" className="mb-10">
          <h2>{t("cgv.sections.prix.title")}</h2>
          <p>{t("cgv.sections.prix.content")}</p>
        </section>

        <section id="paiement" className="mb-10">
          <h2>{t("cgv.sections.paiement.title")}</h2>
          <p>{t("cgv.sections.paiement.content")}</p>
        </section>

        <section id="livraison" className="mb-10">
          <h2>{t("cgv.sections.livraison.title")}</h2>
          <p>{t("cgv.sections.livraison.content")}</p>
        </section>

        <section id="retours" className="mb-10">
          <h2>{t("cgv.sections.retours.title")}</h2>
          <p>{t("cgv.sections.retours.content")}</p>
        </section>

        <section id="responsabilite" className="mb-10">
          <h2>{t("cgv.sections.responsabilite.title")}</h2>
          <p>{t("cgv.sections.responsabilite.content")}</p>
        </section>

        <section id="donnees" className="mb-10">
          <h2>{t("cgv.sections.donnees.title")}</h2>
          <p>
            {t("cgv.sections.donnees.content")}{" "}
            <a href="/politique-de-confidentialite" className="text-primary underline">
              {t("cgv.sections.donnees.link")}
            </a>
          </p>
        </section>

        <section id="droit" className="mb-10">
          <h2>{t("cgv.sections.droit.title")}</h2>
          <p>{t("cgv.sections.droit.content")}</p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">{t("cgv.updated")}</p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default ConditionsGeneralesDeVentePage;
