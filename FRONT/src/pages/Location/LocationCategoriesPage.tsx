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

import AddLocationCategoryModal from "@/components/location/AddLocationCategoryModal";
import EditLocationCategoryModal from "@/components/location/EditLocationCategoryModal";
import AddLocationProductModal from "@/components/location/AddLocationProductModal";
import EditLocationProductModal from "@/components/location/EditLocationProductModal";

/* ================= API ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
type LocationCategory = {
  id: number;
  label: string;
  value: string;
  icon?: string;
};

type LocationProduct = {
  id: number;
  title: string;
  description?: string;
  price_per_day: number;
  category?: {
    label: string;
  };
};

export default function LocationCategoriesPage() {
  const [categories, setCategories] = useState<LocationCategory[]>([]);
  const [products, setProducts] = useState<LocationProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory | null>(null);

  const [confirmProductDelete, setConfirmProductDelete] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const [editProductModalOpen, setEditProductModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories_location`);
      setCategories(await res.json());
    } catch {
      toast.error("Impossible de charger les catégories");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/produits_location`);
      setProducts(await res.json());
    } catch {
      toast.error("Impossible de charger les produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  /* ================= CATEGORIES ================= */
  const openEdit = (id: number) => {
    setSelectedCategoryId(id);
    setEditModalOpen(true);
  };

  const openDelete = (category: LocationCategory) => {
    setSelectedCategory(category);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await fetch(
        `${API_BASE_URL}/api/categories_location/${selectedCategory.id}`,
        { method: "DELETE" }
      );
      toast.success("Catégorie supprimée");
      fetchCategories();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setConfirmDelete(false);
      setSelectedCategory(null);
    }
  };

  /* ================= PRODUITS ================= */
  const handleEditProduct = (product: LocationProduct) => {
    setEditProductId(product.id);
    setEditProductModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    setSelectedProductId(id);
    setConfirmProductDelete(true);
  };

  const confirmAndDeleteProduct = async () => {
    if (!selectedProductId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/produits_location/${selectedProductId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast.success("Produit supprimé");
        fetchProducts();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setConfirmProductDelete(false);
      setSelectedProductId(null);
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
            <h2 className="text-2xl font-bold">Produits de Location</h2>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setAddProductModalOpen(true)}>
                <PlusCircle className="w-5 h-5 mr-2" />
                Ajouter Produit
              </Button>

              <Button onClick={() => setAddModalOpen(true)}>
                <PlusCircle className="w-5 h-5 mr-2" />
                Ajouter Catégorie
              </Button>
            </div>
          </div>

          {/* CATEGORIES */}
          {loading && <p>Chargement...</p>}
          {!loading && categories.length === 0 && (
            <p className="text-gray-500">Aucune catégorie trouvée.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm"
              >
                <p className="font-semibold text-lg">{cat.label}</p>
                <p className="text-sm text-muted-foreground">{cat.value}</p>

                {cat.icon && (
                  <img
                    src={`${API_BASE_URL}/storage/${cat.icon}`}
                    alt={cat.label}
                    className="w-16 h-16 object-contain mt-2"
                  />
                )}

                <div className="flex justify-end gap-2 mt-3">
                  <Button size="icon" variant="outline" onClick={() => openEdit(cat.id)}>
                    <Pencil className="w-4 h-4 text-yellow-600" />
                  </Button>

                  <Button size="icon" variant="destructive" onClick={() => openDelete(cat)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* PRODUITS */}
          {products.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">
                Liste des produits de location
              </h3>

              <table className="w-full border">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 border">Nom</th>
                    <th className="px-4 py-2 border">Catégorie</th>
                    <th className="px-4 py-2 border">Prix (MAD)</th>
                    <th className="px-4 py-2 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-2">{product.title}</td>
                      <td className="px-4 py-2">
                        {product.category?.label || "-"}
                      </td>
                      <td className="px-4 py-2">{product.price_per_day}</td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Pencil className="w-4 h-4 text-yellow-600" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MODALES */}
          {editProductModalOpen && editProductId && (
            <EditLocationProductModal
              open={editProductModalOpen}
              onOpenChange={setEditProductModalOpen}
              productId={editProductId}
              onUpdated={fetchProducts}
            />
          )}

          {addModalOpen && (
            <AddLocationCategoryModal
              open={addModalOpen}
              onOpenChange={setAddModalOpen}
              onSuccess={fetchCategories}
            />
          )}

          {addProductModalOpen && (
            <AddLocationProductModal
              open={addProductModalOpen}
              onOpenChange={setAddProductModalOpen}
              onSuccess={fetchProducts}
            />
          )}

          {editModalOpen && selectedCategoryId && (
            <EditLocationCategoryModal
              open={editModalOpen}
              onOpenChange={setEditModalOpen}
              categoryId={selectedCategoryId}
              onUpdated={fetchCategories}
            />
          )}

          {/* CONFIRM DELETE PRODUCT */}
          <Dialog open={confirmProductDelete} onOpenChange={setConfirmProductDelete}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">
                  Supprimer ce produit ?
                </DialogTitle>
                <DialogDescription>
                  Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setConfirmProductDelete(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={confirmAndDeleteProduct}>
                  Supprimer
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* CONFIRM DELETE CATEGORY */}
          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">
                  Supprimer cette catégorie ?
                </DialogTitle>
                <DialogDescription>
                  Voulez-vous vraiment supprimer{" "}
                  <strong>{selectedCategory?.label}</strong> ?
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
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
