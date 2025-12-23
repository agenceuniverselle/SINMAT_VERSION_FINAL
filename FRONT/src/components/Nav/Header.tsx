import { useNavigate, useLocation } from "react-router-dom"; 
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginModal } from "../Authentification/LoginModal";
import { getWishlist } from "@/utils/wishlistUtils";
import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next"; // Import i18n

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { count: cartCount } = useCart();

  const navigate = useNavigate();
  const location = useLocation();
  const { count } = useWishlist();
  const { t, i18n } = useTranslation(); // Destructuring t and i18n

  const handleCreateAccount = () => {
    setIsLoginOpen(false);
    navigate("/register");
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const currentPath = window.location.pathname;

    const query = `?search=${encodeURIComponent(searchTerm.trim())}`;

    if (
      ["/Catalogue", "/location", "/blog"].includes(currentPath)
    ) {
      navigate(`${currentPath}${query}`);
    } else {
      navigate(`/Catalogue${query}`);
    }
  };

  const [wishlistCount, setWishlistCount] = useState<number>(0);

  useEffect(() => {
    const syncWishlist = () => {
      setWishlistCount(getWishlist().length);
    };

    syncWishlist();
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/images/sinmat.jpeg"
                alt="Logo Sinmat"
                className="w-48 h-28 object-contain"
              />
            </a>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl w-full">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder={t("header.searchPlaceholder")}
                  className="w-full pr-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLoginOpen(true)}
              className="hidden md:flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">{t("header.login")}</span>
            </Button>

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

      <LoginModal
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onCreateAccount={handleCreateAccount}
      />
    </header>
  );
};

export default Header;
