import { useEffect, useState } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import AddLocationProductModal from "@/components/location/AddLocationProductModal";

/* ================= API ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
type LocationProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
};

export default function LocationProductsPage() {
  const [products, setProducts] = useState<LocationProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<LocationProduct | null>(null);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/produits_location`);
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await fetch(
        `${API_BASE_URL}/api/location_products/${selectedProduct.id}`,
        { method: "DELETE" }
      );

      toast.success("Produit supprimé");
      fetchProducts();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setConfirmDelete(false);
      setSelectedProduct(null);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <AppSidebar />

      <div className="flex-1 min-h-screen ml-[80px] lg:ml-[250px] transition-all">
        <AppHeader />

        <main className="p-6">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Produits de location</h2>
            <Button onClick={() => setAddModalOpen(true)}>
              <PlusCircle className="w-5 h-5 mr-2" />
              Ajouter un produit
            </Button>
          </div>

          {/* ETATS */}
          {loading && <p>Chargement...</p>}
          {!loading && products.length === 0 && (
            <p className="text-gray-500">Aucun produit trouvé.</p>
          )}

          {/* GRID PRODUITS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-3">
                  {prod.image && (
                    <div className="w-full h-40 mb-3 overflow-hidden rounded-md border">
                      <img
                        src={`${API_BASE_URL}/storage/${prod.image}`}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <p className="font-semibold text-lg">{prod.name}</p>

                  {prod.description && (
                    <p className="text-sm text-muted-foreground">
                      {prod.description}
                    </p>
                  )}

                  <p className="text-sm mt-1 text-green-600">
                    {prod.price} MAD / jour
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      toast.info("Fonction d’édition à venir")
                    }
                  >
                    <Pencil className="w-4 h-4 text-yellow-600" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setConfirmDelete(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL AJOUT */}
          {addModalOpen && (
            <AddLocationProductModal
              open={addModalOpen}
              onOpenChange={setAddModalOpen}
              onSuccess={fetchProducts}
            />
          )}

          {/* CONFIRM DELETE */}
          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">
                  Supprimer ce produit ?
                </DialogTitle>
                <DialogDescription>
                  Voulez-vous vraiment supprimer{" "}
                  <strong>{selectedProduct?.name}</strong> ?
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}
                >
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
