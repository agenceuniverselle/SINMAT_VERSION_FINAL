import { useState } from "react";
import { MapPin, Phone, Menu, X } from "lucide-react";
import CategoriesMenu from "@/components/Produit/CategoriesMenu";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Navigation = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: t("navigation.home"), href: "/" },
    { label: t("navigation.shop"), href: "/Catalogue" },
    { label: t("navigation.rent"), href: "/location" },
    { label: t("navigation.blog"), href: "/blog" },
    { label: t("navigation.about"), href: "/a-propos" },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* ===== TOP BAR ===== */}
        <div className="flex items-center justify-between h-14">

          {/* LEFT — Categories (DESKTOP ONLY) */}
          <div className="hidden md:flex">
            <CategoriesMenu />
          </div>

          {/* CENTER — Links (DESKTOP ONLY) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* RIGHT — Contact (DESKTOP ONLY) */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span>{t("navigation.address")}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <span dir="ltr" style={{ unicodeBidi: "bidi-override" }}>
                {t("navigation.phone")}
              </span>
            </div>
          </div>

          {/* MOBILE MENU BUTTON — RIGHT */}
        <button
  className="md:hidden ml-auto p-2"
  onClick={() => setOpen(!open)}
  aria-label="Menu"
>

            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ===== MOBILE MENU ===== */}
        {open && (
          <div className="md:hidden border-t py-4 space-y-4">
            {/* Links */}
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Contact */}
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{t("navigation.address")}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span dir="ltr" style={{ unicodeBidi: "bidi-override" }}>
                  {t("navigation.phone")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
