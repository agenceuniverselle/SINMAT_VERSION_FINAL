"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";

import { List, Grid3x3, BadgeCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";

import { RentalModal } from "@/components/location/RentalModal";

/* ================= API ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
type Category = {
  id: number;
  label: string;
  value: string;
};

type LocationProduct = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  price_per_day: number;
  status: "disponible" | "sur_commande" | "non_disponible";
  category_value: string;
};

const Location = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<LocationProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [isPriceFilterApplied, setIsPriceFilterApplied] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [selectedProduct, setSelectedProduct] =
    useState<LocationProduct | null>(null);
  const [openRentalModal, setOpenRentalModal] = useState(false);

  const searchTerm =
    new URLSearchParams(location.search)
      .get("search")
      ?.toLowerCase() || "";

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories_location`)
      .then((res) => res.json())
      .then(setCategories);

    fetch(`${API_BASE_URL}/api/produits_location`)
      .then((res) => res.json())
      .then((data) =>
        setProducts(
          data.map((p: any) => ({
            id: p.id,
            name: p.title,
            description: p.description,
            image: p.image,
            price_per_day: Number(p.price_per_day),
            status: p.status,
            category_value: p.category?.value ?? "",
          }))
        )
      );
  }, []);

  /* ================= FILTERS ================= */
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      !selectedCategory || p.category_value === selectedCategory;

    const matchPrice =
      !isPriceFilterApplied ||
      (p.price_per_day >= priceRange[0] &&
        p.price_per_day <= priceRange[1]);

    const matchSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm);

    return matchCategory && matchPrice && matchSearch;
  });

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Navigation />

      {/* ================= PRODUITS ================= */}
      <section className="py-12">
        <div className="container mx-auto flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 space-y-6 order-1 lg:order-none">

            {/* CATEGORIES */}
            <Card className="order-1">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">
                  {t("location.categories")}
                </h3>

                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      checked={selectedCategory === cat.value}
                      onChange={() => setSelectedCategory(cat.value)}
                    />
                    {cat.label}
                  </label>
                ))}

                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-muted-foreground mt-3 hover:underline"
                >
                  {t("location.resetCategory")}
                </button>
              </CardContent>
            </Card>

            {/* PRICE FILTER — SOUS CATÉGORIES */}
            <Card className="order-2">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">
                  {t("location.priceFilter")}
                </h3>

                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={1000}
                  step={10}
                />

                <p className="text-sm text-muted-foreground">
                  {t("location.priceLabel", {
                    min: priceRange[0],
                    max: priceRange[1],
                  })}
                </p>

                <Button
                  className="w-full"
                  onClick={() => setIsPriceFilterApplied(true)}
                >
                  {t("location.applyFilters")}
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* PRODUITS */}
          <div className="flex-1 order-2 lg:order-none">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <p className="text-muted-foreground">
                {t("location.showing", {
                  count: filteredProducts.length,
                })}
              </p>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((p) => (
                <Card key={p.id}>
                  <img
                    src={
                      p.image
                        ? `${API_BASE_URL}/storage/${p.image}`
                        : "/images/placeholder.jpg"
                    }
                    alt={p.name}
                    className="h-40 sm:h-48 md:h-52 w-full object-cover"
                  />

                  <CardContent className="p-4">
                    <Badge className="mb-2">
                      {t(`location.status.${p.status}`)}
                    </Badge>

                    <h3 className="font-semibold">{p.name}</h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>

                    <p className="mt-3 font-bold text-primary">
                      {t("location.priceFrom")} {p.price_per_day} MAD{" "}
                      <span className="text-sm">
                        {t("location.perDay")}
                      </span>
                    </p>

                    <Button
                      className="w-full mt-3"
                      onClick={() => {
                        setSelectedProduct(p);
                        setOpenRentalModal(true);
                      }}
                    >
                      {t("location.rentNow")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* MODAL LOCATION */}
      <RentalModal
        product={
          selectedProduct
            ? {
                ...selectedProduct,
                title: selectedProduct.name,
                available: selectedProduct.status === "disponible",
              }
            : null
        }
        open={openRentalModal}
        onOpenChange={setOpenRentalModal}
      />
    </div>
  );
};

export default Location;
