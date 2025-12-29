"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";

import SidebarFilters from "@/components/shop/SidebarFilters";
import ProductCard from "@/components/shop/ProductCard";

import { Grid3x3, LayoutGrid, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/* ================= API ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------------- TYPES ---------------- */
export interface Product {
  id: number;
  name: string;
  category: string;
  categoryId: number;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  hoverImage: string;
  images: string[];
  inStock: boolean;
  onSale: boolean;
  description: string;
  status?: string;
  additionalInfo: {
    label: string;
    value: string;
  }[];
}

interface LaravelProduct {
  id: number;
  name: string;
  sale_price: number;
  purchase_price: number;
  quantity: number;
  images: string | null;
  category: { id: number; name: string } | null;
  status?: string;
}

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

/* ================= SHOP ================= */
const Shop = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryTree, setCategoryTree] = useState<Map<number, number[]>>(
    new Map()
  );
  const [isCategoryTreeReady, setIsCategoryTreeReady] = useState(false);

  const [viewMode, setViewMode] = useState<"grid" | "list" | "grid-4">("grid");
  const [itemsPerPage, setItemsPerPage] = useState("9");

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const searchTerm =
    new URLSearchParams(location.search)
      .get("search")
      ?.toLowerCase() || "";

  /* -------- CATEGORY FROM URL -------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryIdFromURL = params.get("category");
    if (
      categoryIdFromURL &&
      !selectedCategories.includes(Number(categoryIdFromURL))
    ) {
      setSelectedCategories([Number(categoryIdFromURL)]);
    }
  }, [location.search]);

  /* -------- FETCH PRODUCTS -------- */
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/produits`);
      if (!res.ok) throw new Error();

      const data: LaravelProduct[] = await res.json();

      const mapped: Product[] = data.map((p) => {
        let imgs: string[] = [];
        try {
          imgs = p.images ? JSON.parse(p.images) : [];
        } catch {
          /* ignore */
        }

        const fullImages = imgs.map(
          (img) => `${API_BASE_URL}/storage/${img}`
        );

        return {
          id: p.id,
          name: p.name,
          category: p.category?.name ?? t("shop.uncategorized"),
          categoryId: p.category?.id ?? 0,
          price: Number(p.sale_price),
          oldPrice: Number(p.purchase_price),
          image: fullImages[0] ?? "/no-image.png",
          hoverImage: fullImages[1] ?? fullImages[0] ?? "/no-image.png",
          images: fullImages,
          rating: 4.5,
          reviews: 20,
          inStock: p.quantity > 0,
          onSale: Number(p.sale_price) < Number(p.purchase_price),
          description: t("shop.noDescription"),
          additionalInfo: [
            {
              label: t("shop.stock"),
              value: String(p.quantity),
            },
            {
              label: t("shop.category"),
              value: p.category?.name ?? t("shop.uncategorized"),
            },
          ],
          status: p.status,
        };
      });

      setProducts(mapped);
      setFilteredProducts(mapped);
    } catch {
      toast.error(t("shop.errors.products"));
    }
  };
useEffect(() => {
  if (products.length > 0) {
    const prices = products.map((p) => p.price);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    setPriceRange([min, max]);
  }
}, [products]);

  /* -------- FETCH CATEGORIES -------- */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (!res.ok) throw new Error();

      const data: Category[] = await res.json();

      const tree = new Map<number, number[]>();
      data.forEach((cat) => {
        const parentId = cat.parent_id ?? 0;
        if (!tree.has(parentId)) tree.set(parentId, []);
        tree.get(parentId)!.push(cat.id);
      });

      setCategoryTree(tree);
      setIsCategoryTreeReady(true);
    } catch {
      toast.error(t("shop.errors.categories"));
    }
  };

  const getDescendantIds = (id: number): number[] => {
    const children = categoryTree.get(id) ?? [];
    return children.flatMap((child) => [
      child,
      ...getDescendantIds(child),
    ]);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

/* -------- FILTERING -------- */
useEffect(() => {
  if (!isCategoryTreeReady) return;

  let result = [...products];

  const [min, max] = priceRange;
  if (min !== max) {
    result = result.filter((p) => p.price >= min && p.price <= max);
  }

  if (selectedCategories.length > 0) {
    const allIds = selectedCategories.flatMap((id) => [
      id,
      ...getDescendantIds(id),
    ]);
    result = result.filter((p) => allIds.includes(p.categoryId));
  }

  if (selectedStatuses.length > 0) {
    result = result.filter((p) =>
      selectedStatuses.includes(p.status ?? "")
    );
  }

  if (searchTerm) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
  }

  setFilteredProducts(result);
}, [
  products,
  priceRange,
  selectedCategories,
  selectedStatuses,
  categoryTree,
  isCategoryTreeReady,
  searchTerm,
]);


  const displayedProducts =
    itemsPerPage === "all"
      ? filteredProducts
      : filteredProducts.slice(0, parseInt(itemsPerPage));

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:sticky lg:top-4">
            <SidebarFilters
              products={products}
              onPriceChange={(min, max) => setPriceRange([min, max])}
              onCategoryChange={(ids) => setSelectedCategories(ids)}
              onStatusChange={(statuses) => setSelectedStatuses(statuses)}
            />
          </aside>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{t("shop.show")}</span>
                <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="all">
                      {t("shop.all")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode("list")} className="p-2 rounded">
                  <List className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("grid")} className="p-2 rounded">
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid-4")}
                  className="p-2 rounded"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className={`grid gap-6 ${
                viewMode === "list"
                  ? "grid-cols-1"
                  : viewMode === "grid-4"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
