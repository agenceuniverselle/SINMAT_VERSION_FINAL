"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  category: string;
  reviews: number;
  onSale: boolean;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  children?: Category[];
}

interface SidebarFiltersProps {
  products: Product[];
  onPriceChange?: (min: number, max: number) => void;
  onStatusChange?: (status: string[]) => void;
  onCategoryChange?: (categories: number[]) => void;
}

/* ================= COMPONENT ================= */

const SidebarFilters = ({
  products,
  onPriceChange,
  onStatusChange,
  onCategoryChange,
}: SidebarFiltersProps) => {
  const { t } = useTranslation();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceRangeDraft, setPriceRangeDraft] =
    useState<[number, number]>([0, 0]);

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);

  /* ---------- PRICE RANGE ---------- */
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRangeDraft([min, max]);
    }
  }, [products]);

  const handlePriceApply = () => {
    onPriceChange?.(priceRangeDraft[0], priceRangeDraft[1]);
  };

  /* ---------- CATEGORIES ---------- */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (e) {
      console.error("Erreur chargement catégories", e);
    }
  };

  const getAllDescendantIds = (cat: Category): number[] => {
    const children = cat.children || [];
    return children.reduce(
      (acc, child) => [...acc, child.id, ...getAllDescendantIds(child)],
      [] as number[]
    );
  };

  const handleCategoryChange = (parentCategory: Category, checked: boolean) => {
    const allIds = [parentCategory.id, ...getAllDescendantIds(parentCategory)];

    const updated = checked
      ? [...new Set([...selectedCategories, ...allIds])]
      : selectedCategories.filter((id) => !allIds.includes(id));

    setSelectedCategories(updated);
    onCategoryChange?.(updated);
  };

  /* ---------- STATUS ---------- */
  const handleStatusChange = (status: string, checked: boolean) => {
    const updated = checked
      ? [...selectedStatus, status]
      : selectedStatus.filter((s) => s !== status);

    setSelectedStatus(updated);
    onStatusChange?.(updated);
  };

  /* ---------- TOP RATED ---------- */
  const fetchTopRated = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/produits`);
      const data = await res.json();

      setTopRated(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.slice(0, 4).map((p: any) => {
          let imgs: string[] = [];
          try {
            imgs = p.images ? JSON.parse(p.images) : [];
          } catch {}

          return {
            id: p.id,
            name: p.name,
            price: Number(p.sale_price),
            oldPrice: Number(p.purchase_price),
            image: imgs[0]
              ? `${API_BASE_URL}/storage/${imgs[0]}`
              : "/no-image.png",
            rating: 4,
            reviews: 10,
            category: p.category?.name ?? t("filters.uncategorized"),
            categoryId: p.category?.id ?? 0,
            onSale: Number(p.sale_price) < Number(p.purchase_price),
          };
        })
      );
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
    fetchTopRated();
  }, []);

  const parentCategories = categories.filter((c) => c.parent_id === null);

  return (
    <div className="w-full lg:w-64 space-y-8">

      {/* ===== PRICE ===== */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">
          {t("filters.priceFilter")}
        </h3>

        <Slider
          value={priceRangeDraft}
          onValueChange={(val) => setPriceRangeDraft([val[0], val[1]])}
          min={minPrice}
          max={maxPrice}
          step={50}
          className="mb-4"
        />

        <div className="text-sm text-muted-foreground" dir="ltr">
          {t("filters.priceLabel", {
            min: priceRangeDraft[0],
            max: priceRangeDraft[1],
            currency: t("filters.currency"),
          })}
        </div>

        <Button
          onClick={handlePriceApply}
          variant="outline"
          className="w-full mt-4"
        >
          {t("filters.apply")}
        </Button>
      </div>

      {/* ===== CATEGORIES ===== */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">
          {t("filters.categories")}
        </h3>

        <div className="space-y-3">
          {parentCategories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(cat, checked as boolean)
                }
              />
              <label className="text-sm cursor-pointer">{cat.name}</label>
            </div>
          ))}
        </div>
      </div>

      {/* ===== STATUS ===== */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">
          {t("filters.status")}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedStatus.includes("nouveaute")}
              onCheckedChange={(checked) =>
                handleStatusChange("nouveaute", checked as boolean)
              }
            />
            <label className="text-sm cursor-pointer">
              {t("filters.new")}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedStatus.includes("promotion")}
              onCheckedChange={(checked) =>
                handleStatusChange("promotion", checked as boolean)
              }
            />
            <label className="text-sm cursor-pointer">
              {t("filters.promotion")}
            </label>
          </div>
        </div>
      </div>

      {/* ===== TOP RATED ===== */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">
          {t("filters.topRated")}
        </h3>

        <div className="space-y-6">
          {topRated.map((product) => (
            <Link
              key={product.id}
              to={`/Catalogue/product/${product.id}`}
              className="flex gap-3 group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />

              <div className="flex-1">
                <h4 className="text-sm font-medium group-hover:text-[#ff6a00] line-clamp-2">
                  {product.name}
                </h4>

                <div className="flex items-center gap-1 my-1">
                  {Array.from({ length: product.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-[#ff6a00] text-[#ff6a00]"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2" dir="ltr">
                  {product.oldPrice && (
                    <span className="text-xs line-through text-muted-foreground">
                      {product.oldPrice.toFixed(2)} {t("filters.currency")}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#ff6a00]">
                    {product.price.toFixed(2)} {t("filters.currency")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SidebarFilters;
