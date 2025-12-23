"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";

type Product = {
  id: number;
  name: string;
  category: { name: string } | null;
  price: number;
  oldPrice?: number;
  images: string[];
};

const BestsellerProducts = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { add: addToWishlist } = useWishlist();
  const { add: addToCart } = useCart();

  const handleAddToCart = (productId: number) => {
    addToCart(productId);
    toast.success(t("bestseller.addToCartSuccess"));
  };

  const handleAddToWishlist = (productId: number) => {
    addToWishlist(productId);
    toast.success(t("bestseller.addToWishlistSuccess"));
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/produits/latest");
      if (!res.ok) throw new Error();

      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category ?? null,
        price: Number(p.sale_price),
        oldPrice: p.purchase_price ? Number(p.purchase_price) : undefined,
        images: p.images?.map(
          (img: string) => `http://localhost:8000/storage/${img}`
        ) ?? [],
      }));

      setProducts(mapped);
    } catch {
      toast.error(t("bestseller.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasShownPopup) {
          setShowModal(true);
          setHasShownPopup(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasShownPopup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() && !phone.trim()) {
      toast.error(t("bestseller.errors.required"));
      return;
    }

    if (email.trim() && !email.toLowerCase().endsWith("@gmail.com")) {
      toast.error(t("bestseller.errors.invalidEmail"));
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      if (!res.ok) throw new Error();

      toast.success(t("bestseller.errors.submitSuccess"));
      setEmail("");
      setPhone("");
      setShowModal(false);
    } catch {
      toast.error(t("bestseller.errors.submitFailed"));
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="text-primary">
                {t("bestseller.sectionTitle")}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("bestseller.sectionSubtitle")}
            </p>
          </div>

          <button
            onClick={() => navigate("/catalogue")}
            className="mt-4 md:mt-0 text-sm font-semibold text-gray-800 border-b-2 border-primary hover:text-primary transition"
          >
            {t("bestseller.viewAll")}
          </button>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <p className="text-center text-gray-500">
            {t("bestseller.loading")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition flex flex-col h-full"
              >
                <div className="px-6 pt-6 pb-3">
                  <h3 className="font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {product.category?.name ?? "-"}
                  </p>
                </div>

                <div className="relative w-full h-48 bg-white overflow-hidden">
                  <img
                    src={product.images[0] ?? "/no-image.png"}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain transition-opacity group-hover:opacity-0"
                  />
                  {product.images[1] && (
                    <img
                      src={product.images[1]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}

                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleAddToWishlist(product.id)} className="icon-btn">
                      <Heart size={16} />
                    </button>
                    <button onClick={() => navigate(`/Catalogue/product/${product.id}`)} className="icon-btn">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleAddToCart(product.id)} className="icon-btn">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 mt-auto">
                  <div className="flex gap-3 items-center">
                    {product.oldPrice && (
                      <span className="line-through text-sm text-gray-400">
                        {product.oldPrice.toFixed(2)} MAD
                      </span>
                    )}
                    <span className="text-lg font-bold text-orange-500">
                      {product.price.toFixed(2)} MAD
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/catalogue")}
            className="px-8 py-3 border-2 border-gray-800 rounded font-semibold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
          >
            {t("bestseller.viewAllBottom")}
          </button>
        </div>
      </div>

      {/* NEWSLETTER */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2">
              ✕
            </button>

            <h3 className="text-xl font-bold mb-2">
              {t("bestseller.popupTitle")}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder={t("bestseller.newsletter.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="text-center text-sm text-gray-400">
                {t("bestseller.newsletter.or")}
              </div>

              <Input
                type="tel"
                placeholder={t("bestseller.newsletter.phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Button type="submit">
                {t("bestseller.newsletter.submit")}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                {t("bestseller.newsletter.privacyText")}{" "}
                <a href="/politique-de-confidentialite" className="underline">
                  {t("bestseller.newsletter.privacyPolicy")}
                </a>
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default BestsellerProducts;
