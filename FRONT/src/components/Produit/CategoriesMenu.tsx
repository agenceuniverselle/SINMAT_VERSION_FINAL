"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */
interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  children?: Category[];
}

/* ================= CONFIG ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= COMPONENT ================= */
const CategoriesMenu = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH CATEGORIES ---------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        if (!res.ok) throw new Error();
        setCategories(await res.json());
      } catch (err) {
        console.error("Erreur chargement catégories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Catégories parentes uniquement
  const parentCategories = categories.filter(
    (cat) => cat.parent_id === null && cat.children && cat.children.length > 0
  );

  if (loading || parentCategories.length === 0) return null;

  /* ================= RENDER ================= */
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 text-foreground hover:bg-orange-500 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span className="font-medium">
            {t("navigation.browseCategories")}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[1000px] max-h-[600px] overflow-y-auto bg-background p-6 z-50"
      >
        {/* GRID FLEX RESPONSIVE */}
        <div className="flex flex-wrap gap-x-8 gap-y-6">
          {parentCategories.map((category) => (
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
                        className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
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
