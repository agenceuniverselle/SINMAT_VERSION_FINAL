import { MapPin, Phone } from "lucide-react";
import CategoriesMenu from "@/components/Produit/CategoriesMenu";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const { t } = useTranslation();

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
        <div className="flex items-center justify-between h-14">
          {/* Browse Categories */}
          <CategoriesMenu />
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
<span className="text-foreground">{t("navigation.address")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
             <div className="flex items-center gap-2">
  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
    <Phone className="w-4 h-4 text-primary" />
  </div>

  <span
    className="text-foreground"
    dir="ltr"
    style={{ unicodeBidi: "bidi-override" }}
  >
    {t("navigation.phone")}
  </span>
</div>
  </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
