"use client";

import { useState } from "react";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";

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
  status?: string;
  additionalInfo: { label: string; value: string }[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { add } = useWishlist();
  const { add: addToCart } = useCart();

  const handleAddToCart = (productId: number) => {
    addToCart(productId);
    toast.success(t("productCard.addToCartSuccess"));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product.id);
    toast.success(t("productCard.addToWishlistSuccess"));
  };
const mainImage = product.images?.[0]
  ? `https://sinmat.ma/storage/${product.images[0]}`
  : "/placeholder.png";

const hoverImage = product.images?.[1]
  ? `https://sinmat.ma/storage/${product.images[1]}`
  : mainImage;

  return (
    <Link to={`/Catalogue/product/${product.id}`}>
      <div
        className="group relative bg-background border rounded-lg overflow-hidden
        transition-all duration-300 hover:shadow-xl cursor-pointer
        h-[400px] flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* IMAGE */}
        <div className="relative h-[60%] overflow-hidden bg-gray-50">
   
<img
  src={isHovered ? hoverImage : mainImage}
  alt={product.name}
  className="w-full h-full object-cover transition-all duration-500"
/>



          {/* BADGES */}
          {product.status === "promotion" && (
            <div className="absolute top-3 left-3 bg-[#ff6a00] text-white text-xs font-bold px-3 py-1 rounded">
              {t("productCard.promotion")}
            </div>
          )}
          {product.status === "nouveaute" && (
            <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded">
              {t("productCard.new")}
            </div>
          )}

          {/* OVERLAY BUTTON */}
          <div
            className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(product.id);
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              {t("productCard.addToCart")}
            </button>
          </div>

          {/* ACTION ICONS */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* FAVORIS */}
            <button
              onClick={handleWishlist}
              className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 hover:bg-[#ff6a00] hover:text-white ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4"
              }`}
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* PREVIEW */}
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(`/Catalogue/product/${product.id}`);
              }}
              className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 hover:bg-[#ff6a00] hover:text-white ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4"
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* INFO PRODUIT */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <p className="text-xs text-muted-foreground mb-1">
            {product.category}
          </p>

          <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-[#ff6a00] transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* PRIX */}
          <div className="flex items-center gap-2" dir="ltr">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {product.oldPrice.toFixed(2)} {t("productCard.currency")}
              </span>
            )}
            <span
              className={`text-base font-semibold ${
                product.oldPrice ? "text-[#ff6a00]" : "text-[#333]"
              }`}
            >
              {product.price.toFixed(2)} {t("productCard.currency")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
