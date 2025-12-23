"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductTabs from "@/components/shop/ProductTabs";
import ProductCard from "@/components/shop/ProductCard";

import { Button } from "@/components/ui/button";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export interface Product {
  id: number;
  name: string;
  category: string;
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
  additionalInfo: { label: string; value: string }[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const API = "http://localhost:8000";

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);

  const { toast } = useToast();
  const { add: addToCart } = useCart();
  const { add: addToWishlist } = useWishlist();

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API}/api/produits/${id}`);
      if (!res.ok) throw new Error();

      const p = await res.json();

      const imgs: string[] = Array.isArray(p.images)
        ? p.images.map((img: string) =>
            img.startsWith("http") ? img : `${API}/storage/${img}`
          )
        : [];

      setProduct({
        id: p.id,
        name: p.name,
        category: p.category?.name ?? t("product.uncategorized"),
        price: Number(p.sale_price),
        oldPrice: Number(p.purchase_price),
        image: imgs[0] ?? "/no-image.png",
        hoverImage: imgs[1] ?? imgs[0] ?? "/no-image.png",
        images: imgs,
        rating: 4.5,
        reviews: 20,
        inStock: p.quantity > 0,
        onSale: Number(p.sale_price) < Number(p.purchase_price),
        description: p.description || t("product.defaultDescription"),
        additionalInfo: [
          { label: t("product.stock"), value: String(p.quantity) },
          { label: t("product.category"), value: p.category?.name ?? "-" },
        ],
      });
    } catch {
      navigate("/404");
    }
  };

  const fetchAllProducts = async () => {
    const res = await fetch(`${API}/api/produits`);
    const data = await res.json();

    setAllProducts(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category?.name ?? "",
        price: Number(p.sale_price),
        oldPrice: Number(p.purchase_price),
        image: p.images?.[0] ?? "/no-image.png",
        hoverImage: p.images?.[1] ?? p.images?.[0] ?? "/no-image.png",
        images: p.images ?? [],
        rating: 4.5,
        reviews: 20,
        inStock: p.quantity > 0,
        onSale: Number(p.sale_price) < Number(p.purchase_price),
        description: "",
        additionalInfo: [],
      }))
    );
  };

  useEffect(() => {
    fetchProduct();
    fetchAllProducts();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setRelated(
      allProducts.filter(
        (p) => p.id !== product.id && p.category === product.category
      ).slice(0, 4)
    );
  }, [product, allProducts]);

  if (!product) {
    return <div className="p-10 text-center">{t("product.loading")}</div>;
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product.id);
    toast({
      title: t("product.addedToCartTitle"),
      description: t("product.addedToCartDescription", {
        quantity,
        name: product.name,
      }),
    });
  };

  const handleWishlist = () => {
    addToWishlist(product.id);
    toast({
      title: t("product.addedToWishlistTitle"),
      description: t("product.addedToWishlistDescription", {
        name: product.name,
      }),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">
            {t("product.breadcrumb.home")}
          </Link>
          <span className="mx-2">/</span>
          <Link to="/Catalogue" className="hover:text-primary">
            {t("product.breadcrumb.shop")}
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        {/* Main */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div
              dir="ltr"
              className="text-3xl font-bold text-primary mb-6"
            >
              {product.price.toFixed(2)} {t("product.currency")}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex border rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3">
                  <Minus size={16} />
                </button>
                <input
                  dir="ltr"
                  type="number"
                  className="w-16 text-center border-x"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, +e.target.value || 1))}
                />
                <button onClick={() => setQuantity(quantity + 1)} className="p-3">
                  <Plus size={16} />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1 py-6"
                disabled={!product.inStock}
              >
                {product.inStock
                  ? t("product.addToCart")
                  : t("product.outOfStock")}
              </Button>
            </div>

            <button
              onClick={handleWishlist}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
            >
              <Heart size={16} />
              {t("product.addToWishlist")}
            </button>

            <div className="text-sm mb-8">
              <span className="text-muted-foreground">
                {t("product.category")} :
              </span>{" "}
              <span className="font-semibold">{product.category}</span>
            </div>

            <div className="flex gap-2">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <button key={i} className="w-8 h-8 border rounded-full flex items-center justify-center">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <ProductTabs product={product} />

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">
              {t("product.relatedProducts")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
