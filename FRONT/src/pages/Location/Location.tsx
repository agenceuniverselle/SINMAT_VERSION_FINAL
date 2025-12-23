"use client"; import { useState, useEffect } from "react";
 import { useLocation } from "react-router-dom";
  import { useTranslation } from "react-i18next"; import TopBar from "@/components/Nav/TopBar"; import Header from "@/components/Nav/Header"; import Navigation from "@/components/Nav/Navigation"; import Footer from "@/components/Footer/Footer"; import { List, Grid3x3, Truck, Headphones, BadgeCheck, CheckCircle2, } from "lucide-react"; import { Input } from "@/components/ui/input"; import { Button } from "@/components/ui/button"; import { Badge } from "@/components/ui/badge"; import { Label } from "@/components/ui/label"; import { Slider } from "@/components/ui/slider"; import { Card, CardContent } from "@/components/ui/card"; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"; import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"; import { Textarea } from "@/components/ui/textarea"; import { RentalModal } from "@/components/location/RentalModal";
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
  const [sortOption, setSortOption] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<LocationProduct | null>(null);
  const [openRentalModal, setOpenRentalModal] = useState(false);

  const searchTerm =
    new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetch("http://localhost:8000/api/categories_location")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => console.error("Erreur lors du chargement des catégories"));

    fetch("http://localhost:8000/api/produits_location")
      .then((res) => res.json())
      .then((data) =>
        setProducts(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((p: any) => ({
            id: p.id,
            name: p.title,
            description: p.description,
            image: p.image,
            price_per_day: parseFloat(p.price_per_day),
            status: p.status,
            category_value: p.category?.value ?? "",
          }))
        )
      )
      .catch(() => console.error("Erreur lors du chargement des produits"));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCategory = !selectedCategory || p.category_value === selectedCategory;
    const matchPrice =
      !isPriceFilterApplied ||
      (p.price_per_day >= priceRange[0] && p.price_per_day <= priceRange[1]);
    const matchSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm);

    return matchCategory && matchPrice && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price_per_day - b.price_per_day;
      case "price-desc":
        return b.price_per_day - a.price_per_day;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Navigation />

      {/* SECTION PRODUITS */}
      <section className="py-12">
        <div className="container mx-auto flex gap-8">
          {/* SIDEBAR */}
          <aside className="w-72 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">{t("location.priceFilter")}</h3>
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

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t("location.categories")}</h3>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm">
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
          </aside>

          {/* GRID PRODUITS */}
          <div className="flex-1">
            <div className="flex justify-between mb-6">
              <p className="text-muted-foreground">
                {t("location.showing", { count: filteredProducts.length })}
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
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {sortedProducts.map((p) => (
                <Card key={p.id}>
                  <img
                    src={
                      p.image
                        ? `http://localhost:8000/storage/${p.image}`
                        : "/images/placeholder.jpg"
                    }
                    alt={p.name}
                    className="h-48 w-full object-cover"
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
                      <span className="text-sm">{t("location.perDay")}</span>
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

      {/* SECTION AVANTAGES */}
      <section className="py-16 bg-gradient-to-br from-gray-600 to-black text-white">
        <div className="container mx-auto">
          <h2 className="text-3xl text-center font-bold mb-12">
            {t("location.whyRentTitle")}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {["certified", "delivery", "support", "pricing"].map((key) => (
              <div key={key} className="text-center">
                <BadgeCheck className="mx-auto mb-3" />
                <h3 className="font-semibold">{t(`location.whyRent.${key}`)}</h3>
                <p className="text-sm opacity-80">
                  {t(`location.whyRent.${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION FAQ & FORM */}
      <section className="py-16 bg-dark text-dark-foreground">
        <div className="container mx-auto flex flex-col lg:flex-row gap-12">
          {/* FORM */}
          <div className="w-full lg:w-1/2 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              {t("location.quoteTitle")}
            </h2>
            <p className="text-center mb-8 text-dark-foreground/80">
              {t("location.quoteSubtitle")}
            </p>
            <Card>
              <CardContent className="p-6 space-y-4">
                <form>
                  <div>
                    <Label htmlFor="name">{t("location.form.name")}</Label>
                    <Input id="name" placeholder="Votre nom" />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("location.form.phone")}</Label>
                    <Input id="phone" placeholder="+212 6XX XXX XXX" />
                  </div>
                  <div>
                    <Label htmlFor="location">{t("location.form.site")}</Label>
                    <Input id="location" placeholder="Adresse du chantier" />
                  </div>
                  <div>
                    <Label htmlFor="equipment">{t("location.form.equipment")}</Label>
                    <Input id="equipment" placeholder="Ex: Mini-pelle 1.5T" />
                  </div>
                  <div>
                    <Label htmlFor="duration">{t("location.form.duration")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("location.form.selectDuration")} />
                      </SelectTrigger>
                     <SelectContent>
  <SelectItem value="1day">
    {t("location.durations.1day")}
  </SelectItem>
  <SelectItem value="3days">
    {t("location.durations.3days")}
  </SelectItem>
  <SelectItem value="1week">
    {t("location.durations.1week")}
  </SelectItem>
  <SelectItem value="1month">
    {t("location.durations.1month")}
  </SelectItem>
  <SelectItem value="custom">
    {t("location.durations.custom")}
  </SelectItem>
</SelectContent>

                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">{t("location.form.message")}</Label>
                    <Textarea id="message" placeholder="Détails supplémentaires..." rows={3} />
                  </div>
                  <Button className="w-full" type="submit">
                    {t("location.form.send")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div className="w-full lg:w-1/2 max-w-xl mx-auto self-center" id="faqs">
<h2 className="text-3xl font-bold text-center mb-8">
  {t("location.faqTitle")}
</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">
{t(`location.faq.q${i}`)}
                  </AccordionTrigger>
                  <AccordionContent>{t(`location.faq.a${i}`)}
</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
