import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import Header from "../Nav/Header";
import TopBar from "../Nav/TopBar";
import Navigation from "../Nav/Navigation";

interface TableOfContentsItem {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  tableOfContents?: TableOfContentsItem[];
}

const LegalLayout = ({ children, title, subtitle, tableOfContents }: LegalLayoutProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  const legalPages = [
    { path: "/mentions-legales", name: t("legalLayout.pages.mentions") },
    { path: "/conditions-generales-de-vente", name: t("legalLayout.pages.cgv") },
    { path: "/politique-de-confidentialite", name: t("legalLayout.pages.confidentialite") },
    { path: "/politique-des-cookies", name: t("legalLayout.pages.cookies") },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <TopBar />
      <Header />
      <Navigation />

      {/* Header Section */}
      <div className="pt-28 pb-16 bg-[#444b51]">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">{title}</h1>
          {subtitle && (
            <p className="text-lg text-white/80 max-w-3xl font-montserrat">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-playfair text-xl font-bold text-[#444b51] mb-6">
                {t("legalLayout.sidebar.title")}
              </h3>

              <nav className="space-y-2 mb-8">
                {legalPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className={cn(
                      "block py-2 px-3 rounded-md transition-colors font-montserrat",
                      currentPath === page.path
                        ? "bg-orange-100 text-primary font-semibold dark:bg-[#EF7A43] dark:text-black"
                        : "text-black dark:text-black hover:bg-orange-100 dark:hover:bg-[#EF7A43]"
                    )}
                  >
                    {page.name}
                  </Link>
                ))}
              </nav>

              {tableOfContents && tableOfContents.length > 0 && (
                <>
                  <h3 className="font-playfair text-lg font-bold text-[#444b51] mb-4">
                    {t("legalLayout.sidebar.toc")}
                  </h3>
                  <nav className="space-y-1">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block py-1.5 px-3 text-sm text-gray-600 hover:text-primary dark:hover:text-[#EF7A43] transition-colors"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="bg-white text-black dark:text-black rounded-lg shadow-md p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
