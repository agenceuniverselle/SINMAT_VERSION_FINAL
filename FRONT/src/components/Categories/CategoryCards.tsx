/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddCategoryModal } from "./AddCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Category = {
  id: number;
  name: string;
  icon: string;
  description?: string;
};

/** ✅ URLs dynamiques */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export default function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔵 Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // 🔴 DELETE DIALOG
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (!res.ok) throw new Error();
      setCategories(await res.json());
    } catch {
      toast.error("Impossible de charger les catégories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEdit = (id: number) => {
    setSelectedCategoryId(id);
    setEditModalOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setConfirmDelete(true);
  };

  // 🔥 SUPPRESSION
  const deleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/categories/${selectedCategory.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      setCategories((prev) =>
        prev.filter((c) => c.id !== selectedCategory.id)
      );

      toast.success("Catégorie supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setConfirmDelete(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Catégories</h2>

        <Button onClick={() => setAddModalOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Ajouter une catégorie
        </Button>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && categories.length === 0 && (
        <p className="text-gray-500">Aucune catégorie pour l’instant.</p>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="
              bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
              shadow-sm rounded-xl p-4 flex flex-col gap-3
              hover:shadow-md transition-all
            "
          >
            {/* ICON + NAME */}
            <div className="flex items-center gap-3">
              <div
                className="
                  w-20 h-20 flex items-center justify-center rounded-md
                  dark:bg-gray-800 overflow-hidden border
                "
              >
                <img
                  src={`${APP_BASE_URL}/storage/${cat.icon}`}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                {cat.name}
              </h3>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => openEdit(cat.id)}
              >
                <Pencil className="w-4 h-4 text-yellow-600" />
              </Button>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => openDeleteDialog(cat)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      {addModalOpen && (
        <AddCategoryModal
          isOpen={addModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            fetchCategories();
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editModalOpen && selectedCategoryId !== null && (
        <EditCategoryModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          categoryId={selectedCategoryId}
          onUpdated={fetchCategories}
        />
      )}

      {/* DELETE DIALOG */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Confirmation de suppression
            </DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer la catégorie :
              <br />
              <strong>{selectedCategory?.name}</strong> ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(false)}
            >
              Annuler
            </Button>

            <Button variant="destructive" onClick={deleteCategory}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
