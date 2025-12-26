import {
  Mail,
  Facebook,
  Instagram,
  MessageCircleCode,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import NewsletterModal from "@/components/Newsletter/NewsletterModal";
import { useTranslation } from "react-i18next";

const TopBar = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const { t, i18n } = useTranslation();

  // RTL auto
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const changeLang = (lang: "fr" | "ar") => {
    i18n.changeLanguage(lang);
    setOpenLang(false);
  };

  return (
    <>
      <div className="bg-gray-600 text-topbar-foreground text-xs py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">

            {/* ===== LEFT : LINKS + SOCIAL (MOBILE & DESKTOP) ===== */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => setShowNewsletter(true)}
                className="flex items-center gap-1 hover:text-primary transition"
              >
                <Mail className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {t("topbar.newsletter")}
                </span>
              </button>

              <a href="/contact" className="hover:text-primary transition">
                {t("topbar.contact")}
              </a>

              <a href="/faqs" className="hover:text-primary transition">
                {t("topbar.faqs")}
              </a>

              <div className="flex items-center gap-3">
                <a href="https://www.facebook.com/share/1BynC318yp/">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/sinmat.sarl">
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/212669487597"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircleCode className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* ===== RIGHT : SLOGAN (DESKTOP) + LANG ===== */}
            <div className="flex items-center gap-6 text-sm font-medium text-gray-100">

              {/* SLOGAN – DESKTOP ONLY */}
              <span className="hidden md:flex items-center gap-2 font-semibold tracking-wide">
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

              {/* LANG SELECTOR – GLOBE */}
              <div className="relative">
                <button
                  onClick={() => setOpenLang((v) => !v)}
                  className="hover:text-primary transition"
                  aria-label="Language"
                >
                  <Globe className="w-4 h-4" />
                </button>

                {openLang && (
                  <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => changeLang("fr")}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Français
                    </button>
                    <button
                      onClick={() => changeLang("ar")}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      العربية
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewsletterModal
        open={showNewsletter}
        onOpenChange={setShowNewsletter}
      />
    </>
  );
};

export default TopBar;
