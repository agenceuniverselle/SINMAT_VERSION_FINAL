import { useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginModal } from "../Authentification/LoginModal";
import { getWishlist } from "@/utils/wishlistUtils";
import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { count: cartCount } = useCart();
  const { count } = useWishlist();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCreateAccount = () => {
    setIsLoginOpen(false);
    navigate("/register");
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const query = `?search=${encodeURIComponent(searchTerm.trim())}`;
    const currentPath = window.location.pathname;

    if (["/Catalogue", "/location", "/blog"].includes(currentPath)) {
      navigate(`${currentPath}${query}`);
    } else {
      navigate(`/Catalogue${query}`);
    }
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

          {/* LOGO */}
          <a href="/" className="flex items-center">
            <img
              src="/images/sinmat.jpeg"
              alt="Logo Sinmat"
              className="w-48 h-28 object-contain"
            />
          </a>

          {/* SEARCH */}
          <div className="flex-1 max-w-2xl w-full">
            <div className="relative">
              <Input
                placeholder={t("header.searchPlaceholder")}
                className="w-full pr-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                size="icon"
                className="absolute right-0 top-0 h-full rounded-l-none bg-primary hover:bg-primary/90"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">

            {/* ✅ LOGIN DESKTOP (inchangé) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLoginOpen(true)}
              className="hidden md:flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">{t("header.login")}</span>
            </Button>

            {/* ✅ LOGIN MOBILE (NOUVEAU – même style icône) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsLoginOpen(true)}
              aria-label="Se connecter"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* ❤️ WISHLIST (TOUCHÉ À RIEN) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {count}
              </span>
            </Button>

            {/* 🛒 CART (TOUCHÉ À RIEN) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/checkout")}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Button>

          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      <LoginModal
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onCreateAccount={handleCreateAccount}
      />
    </header>
  );
};

export default Header;
