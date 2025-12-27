import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

const CategoriesMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ API depuis .env.production / .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { t } = useTranslation();

  useEffect(() => {
   fetch(`${API_BASE_URL}/api/categories`)

      .then((res) => res.json())
      .then(setCategories)
      .catch((err) =>
        console.error("Erreur chargement catégories", err)
      );
  }, [API_BASE_URL]);

  return (
    <DropdownMenu>
     <DropdownMenuTrigger asChild>
  <Button
    variant="ghost"
    className="
      hidden md:flex
      gap-2 text-foreground 
      hover:bg-orange-500 hover:text-white 
      transition-colors
    "
  >
    <Menu className="w-5 h-5" />
    <span className="font-medium">
      {t("navigation.browseCategories")}
    </span>
  </Button>
</DropdownMenuTrigger>


      <DropdownMenuContent
        className="w-[1000px] max-h-[600px] overflow-y-auto bg-background p-6 z-50"
        align="start"
        sideOffset={8}
      >
        {/* ✅ FLEX WRAP pour éviter les espaces vides */}
        <div className="flex flex-wrap gap-x-8 gap-y-6">
          {categories.map((category) => (
            <div key={category.id} className="w-[220px]">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-base font-semibold text-foreground mb-2 px-0">
                  {category.name}
                </DropdownMenuLabel>

                <ul className="space-y-1.5">
                  {category.children?.map((child) => (
                    <li key={child.id}>
                      <Link
                        to={`/Catalogue?category=${child.id}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </DropdownMenuGroup>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesMenu;
