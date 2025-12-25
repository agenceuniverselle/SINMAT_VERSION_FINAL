import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, Trash2, Pencil, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddProductModal } from "./AddProductModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { EditProductModal } from "./EditProductModal";

/* ✅ API dynamique */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Product = {
  id: number;
  name: string;
  category: { name: string } | null;
  purchase_price: number;
  sale_price: number;
  quantity: number;
};

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔵 Modal ajout
  const [modalOpen, setModalOpen] = useState(false);

  // 🔴 Dialog suppression
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 🟡 Modal édition
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  const navigate = useNavigate();

  /* 🔽 Charger les produits */
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/produits`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProducts(data);
    } catch {
      toast.error("Impossible de charger les produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setConfirmDelete(true);
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/produits/${selectedProduct.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      setProducts((prev) =>
        prev.filter((p) => p.id !== selectedProduct.id)
      );

      toast.success("Produit supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setConfirmDelete(false);
      setSelectedProduct(null);
    }
  };

  const openEditModal = (productId: number) => {
    setEditProductId(productId);
    setEditModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Liste des produits</h2>

        <Button onClick={() => setModalOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Chargement...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">Aucun produit trouvé.</p>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix d'achat</th>
                <th className="px-4 py-3">Prix de vente</th>
                <th className="px-4 py-3">Quantité</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{prod.name}</td>
                  <td className="px-4 py-2">
                    {prod.category?.name ?? "-"}
                  </td>
                  <td className="px-4 py-2">
                    {prod.purchase_price} MAD
                  </td>
                  <td className="px-4 py-2">
                    {prod.sale_price} MAD
                  </td>
                  <td className="px-4 py-2">
                    {prod.quantity}
                  </td>

                  <td className="px-4 py-2 flex items-center justify-end gap-2">
                    {/* VIEW */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(`/produits/${prod.id}/details`)
                      }
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                    </Button>

                    {/* EDIT */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(prod.id)}
                    >
                      <Pencil className="w-4 h-4 text-yellow-500" />
                    </Button>

                    {/* DELETE */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(prod)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL AJOUT */}
      {modalOpen && (
        <AddProductModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            fetchProducts();
          }}
        />
      )}

      {/* MODAL EDIT */}
      {editModalOpen && editProductId !== null && (
        <EditProductModal
          isOpen={editModalOpen}
          productId={editProductId}
          onClose={() => setEditModalOpen(false)}
          onUpdated={fetchProducts}
        />
      )}

      {/* DIALOG DELETE */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Confirmation de suppression
            </DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer le produit :
              <br />
              <strong>{selectedProduct?.name}</strong> ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(false)}
            >
              Annuler
            </Button>

            <Button
              variant="destructive"
              onClick={deleteProduct}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
