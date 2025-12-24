import { Mail, Facebook, Instagram, MessageCircleCode } from "lucide-react";
import { useState, useEffect } from "react";
import NewsletterModal from "@/components/Newsletter/NewsletterModal";
import { useTranslation } from "react-i18next";

const TopBar = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const { t, i18n } = useTranslation();

  // Gestion RTL automatique selon la langue sélectionnée
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <>
      <div className="bg-gray-600 text-topbar-foreground text-xs py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            {/* Left side - Links and Social */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => setShowNewsletter(true)}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Mail className="w-3 h-3" />
                {t("topbar.newsletter")}
              </button>
              
              <a href="/contact" className="hover:text-primary transition-colors">
                {t("topbar.contact")}
              </a>
              <a href="/faqs" className="hover:text-primary transition-colors">
                {t("topbar.faqs")}
              </a>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/share/1BynC318yp/"
                  className="hover:text-primary transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/sinmat.sarl?igsh=YW5kZTIwcXNlZDJl"
                  className="hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/212669487597"
                  className="hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircleCode className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right side - Slogan and Lang Selector */}
            <div className="flex items-center gap-5 md:gap-8 text-sm font-medium text-gray-100">
              {/* Slogan */}
              <span className="flex items-center gap-2 font-semibold tracking-wide">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m0 0h4m-4 0H7m13 0h2m-2 0v-8m0 8H5"
                  />
                </svg>
                <span>{t("topbar.btp")}</span>
              </span>

              {/* Langue */}
              <div className="relative">
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="appearance-none bg-transparent border border-gray-500/50 rounded-md px-3 py-1.5 pr-8 text-white focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer hover:border-orange-400 transition"
                >
                  <option value="fr" className="text-gray-800 bg-white">
                    {t("topbar.french")}
                  </option>
                  <option value="ar" className="text-gray-800 bg-white">
                    {t("topbar.arabic")}
                  </option>
                </select>

                <svg
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewsletterModal open={showNewsletter} onOpenChange={setShowNewsletter} />
    </>
  );
};

export default TopBar;
