import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { EditProductModal } from "@/components/Produit/EditProductModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";

/* ================= API ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  category_id?: number;
  category: Category | null;
  purchase_price: number;
  sale_price: number;
  quantity: number;
  description?: string;
  images?: string[];
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===== MODALS ===== */
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/produits/${id}`);
      if (!res.ok) throw new Error();

      const prod = await res.json();

      // 🔁 fallback catégorie si non chargée
      if (!prod.category && prod.category_id) {
        const resCat = await fetch(
          `${API_BASE_URL}/api/categories/${prod.category_id}`
        );
        if (resCat.ok) prod.category = await resCat.json();
      }

      setProduct(prod);
    } catch (e) {
      console.error("Erreur lors du chargement du produit :", e);
      toast.error("Impossible de charger le produit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  /* ================= DELETE ================= */
  const deleteProduct = async () => {
    if (!product) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/produits/${product.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      toast.success("Produit supprimé");
      navigate("/produits");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  /* ================= STATES ================= */
  if (loading) return <p className="p-6">Chargement...</p>;
  if (!product) return <p className="p-6">Produit introuvable.</p>;

  /* ================= RENDER ================= */
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <AppSidebar />

      <div className="flex-1 min-h-screen ml-[80px] lg:ml-[250px]">
        <AppHeader />

        <main className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {product.name}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ===== IMAGES ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.images?.length ? (
                product.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${API_BASE_URL}/storage/${img}`}
                    alt={product.name}
                    className="w-full h-60 object-cover rounded-xl shadow-sm"
                  />
                ))
              ) : (
                <div className="h-60 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">Aucune image disponible</p>
                </div>
              )}
            </div>

            {/* ===== INFOS ===== */}
            <Card className="shadow-lg h-fit relative">

              {/* ACTIONS */}
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditModalOpen(true)}
                >
                  <Pencil className="w-4 h-4 text-yellow-500" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>

              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-xl">
                  Informations générales
                </h2>

                <p>
                  <strong>Catégorie :</strong>{" "}
                  {product.category?.name ?? "-"}
                </p>

                <p>
                  <strong>Prix d’achat :</strong>{" "}
                  {product.purchase_price} MAD
                </p>

                <p>
                  <strong>Prix de vente :</strong>{" "}
                  {product.sale_price} MAD
                </p>

                <p>
                  <strong>Stock :</strong>{" "}
                  <Badge
                    variant={
                      product.quantity > 0 ? "default" : "destructive"
                    }
                  >
                    {product.quantity > 0
                      ? `${product.quantity} en stock`
                      : "Rupture"}
                  </Badge>
                </p>

                <div className="pt-4 border-t">
                  <h2 className="font-semibold text-xl mb-2">
                    Description
                  </h2>
                  <p className="whitespace-pre-wrap break-words">
                    {product.description ||
                      "Aucune description disponible."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* ===== MODAL EDIT ===== */}
      {editModalOpen && (
        <EditProductModal
          isOpen={editModalOpen}
          productId={product.id}
          onClose={() => setEditModalOpen(false)}
          onUpdated={fetchProduct}
        />
      )}

      {/* ===== DELETE DIALOG ===== */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">
              Suppression produit
            </DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer :
              <br />
              <strong>{product.name}</strong> ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>

            <Button variant="destructive" onClick={deleteProduct}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
