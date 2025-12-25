import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/* ✅ API & STORAGE dynamiques */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

type Product = {
  id: number;
  name: string;
  price: number;
  images: string[];
};

export default function CheckoutPage() {
  const { cart, add, remove, clear } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  /* 🔐 Validation email */
  const isValidEmail = (email: string) => {
    if (!email) return true; // email facultatif
    const allowedDomains = ["gmail.com", "entreprise.com"];
    const parts = email.split("@");
    if (parts.length !== 2) return false;
    return allowedDomains.includes(parts[1].toLowerCase());
  };

  /* 📦 Charger produits du panier */
  useEffect(() => {
    const fetchProducts = async () => {
      const fetched: Product[] = [];

      for (const item of cart) {
        try {
          const res = await fetch(`${API_BASE_URL}/produits/${item.id}`);
          if (!res.ok) continue;

          const data = await res.json();

          fetched.push({
            id: data.id,
            name: data.name,
            price: Number(data.sale_price),
            images:
              data.images?.map((img: string) =>
                img.startsWith("http")
                  ? img
                  : `${STORAGE_BASE_URL}/${img}`
              ) ?? [],
          });
        } catch {
          console.error("Erreur chargement produit:", item.id);
        }
      }

      setProducts(fetched);
    };

    fetchProducts();
  }, [cart]);

  const getQuantity = (productId: number) =>
    cart.find((item) => item.id === productId)?.quantity ?? 0;

  const getTotal = () =>
    products.reduce((sum, product) => {
      const qty = getQuantity(product.id);
      return sum + product.price * qty;
    }, 0);

  /* 🧾 Envoyer commande */
  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Veuillez remplir les champs requis");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error(
        "Email non autorisé. Utilisez @gmail.com ou un domaine d'entreprise."
      );
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/commandes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          produits: cart,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Commande envoyée avec succès !");
      clear();
      navigate("/");
    } catch {
      toast.error("Erreur lors de l'envoi de la commande");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Navigation />

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Votre commande</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Votre panier est vide.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* 🛒 PANIER */}
            <div className="md:col-span-2 space-y-6">
              {products.map((product) => {
                const quantity = getQuantity(product.id);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex gap-4 items-center w-full">
                      <img
                        src={product.images[0] ?? "/no-image.png"}
                        alt={product.name}
                        className="w-20 h-20 object-contain rounded"
                      />

                      <div className="flex-1">
                        <h2 className="font-semibold">{product.name}</h2>
                        <p className="text-sm text-gray-500">
                          Prix unitaire : {product.price.toFixed(2)} MAD
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <Button size="sm" onClick={() => remove(product.id)}>
                            -
                          </Button>
                          <span>{quantity}</span>
                          <Button size="sm" onClick={() => add(product.id)}>
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="text-lg font-bold text-orange-600">
                        {(product.price * quantity).toFixed(2)} MAD
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="text-right text-xl font-bold text-primary pt-4 border-t">
                Total : {getTotal().toFixed(2)} MAD
              </div>
            </div>

            {/* 🧍 FORMULAIRE */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Informations client
              </h2>

              <Input
                placeholder="Nom complet *"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Input
                placeholder="Téléphone *"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <Input
                type="email"
                placeholder="Email (optionnel)"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <Input
                placeholder="Adresse de livraison *"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <Button
                className="w-full bg-orange-500 text-white"
                onClick={handleSubmit}
              >
                Passer la commande
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  clear();
                  toast.success("Panier vidé");
                }}
              >
                Vider le panier
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
