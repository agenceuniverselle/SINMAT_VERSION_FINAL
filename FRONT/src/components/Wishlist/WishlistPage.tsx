import { useEffect, useState } from "react";
import { getWishlist } from "@/utils/wishlistUtils";
import { useNavigate } from "react-router-dom";

// ✅ Context
import { useWishlist } from "@/context/WishlistContext";

// ✅ Layout components
import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";

type Product = {
  id: number;
  name: string;
  category: { name: string } | null;
  price: number;
  images: string[];
};

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { remove } = useWishlist(); // ✅ Context

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      const ids = getWishlist();

      const fetched = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`http://localhost:8000/api/produits/${id}`);
          if (!res.ok) return null;
          return await res.json();
        })
      );

      const mapped = fetched
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((p): p is Record<string, any> => p !== null)
        .map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category ?? null,
          price: Number(p.sale_price),
          images:
            p.images?.map((img: string) =>
              img.startsWith("http")
                ? img
                : `http://localhost:8000/storage/${img}`
            ) ?? [],
        }));

      setProducts(mapped);
    };

    fetchWishlistProducts();
  }, []);

  const handleRemove = (id: number) => {
    remove(id); // ✅ met à jour le context (Header se met à jour)
    setProducts((prev) => prev.filter((p) => p.id !== id)); // ✅ met à jour la liste locale
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Navigation />

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Votre liste de souhaits</h1>

        {products.length === 0 ? (
          <p className="text-gray-500">Aucun produit dans votre liste.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow flex flex-col"
              >
                <img
                  src={product.images[0] ?? "/no-image.png"}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
                <p className="text-sm text-gray-500">
                  {product.category?.name ?? "-"}
                </p>
                <p className="text-orange-500 font-bold mt-2">
                  {product.price} MAD
                </p>
                <div className="flex gap-3 mt-auto pt-4">
                  <button
                    onClick={() =>
                      navigate(`/Catalogue/product/${product.id}`)
                    }
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
