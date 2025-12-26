import { Mail, Facebook, Instagram, MessageCircleCode, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import NewsletterModal from "@/components/Newsletter/NewsletterModal";
import { useTranslation } from "react-i18next";

const TopBar = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <>
      <div className="bg-gray-600 text-topbar-foreground text-xs py-2">
        <div className="container mx-auto px-4">

          {/* ===== MOBILE TOP ROW ===== */}
          <div className="flex md:hidden items-center justify-between">

            {/* LEFT – links */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNewsletter(true)}
                className="hover:text-primary transition"
                aria-label="Newsletter"
              >
                <Mail className="w-4 h-4" />
              </button>

              <a href="/contact" className="hover:text-primary transition">
                {t("topbar.contact")}
              </a>

              <a href="/faqs" className="hover:text-primary transition">
                {t("topbar.faqs")}
              </a>
            </div>

            {/* RIGHT – language globe */}
            <div className="relative">
              <button
                className="hover:text-primary transition"
                aria-label="Langue"
                onClick={() =>
                  i18n.changeLanguage(i18n.language === "fr" ? "ar" : "fr")
                }
              >
                <Globe className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ===== MOBILE SLOGAN ===== */}
          <div className="flex md:hidden justify-center mt-2 text-gray-100">
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
          </div>

          {/* ===== DESKTOP (UNCHANGED) ===== */}
          <div className="hidden md:flex justify-between items-center gap-2">

            {/* Left side */}
            <div className="flex items-center gap-6">
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

            {/* Right side */}
            <div className="flex items-center gap-8 text-sm font-medium text-gray-100">
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

              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-transparent border border-gray-500/50 rounded-md px-3 py-1.5 text-white cursor-pointer"
              >
                <option value="fr">FR</option>
                <option value="ar">AR</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <NewsletterModal open={showNewsletter} onOpenChange={setShowNewsletter} />
    </>
  );
};

export default TopBar;
