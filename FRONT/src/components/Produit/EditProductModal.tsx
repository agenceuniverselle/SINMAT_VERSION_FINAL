/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  purchasePrice: z.number(),
  salePrice: z.number(),
  quantity: z.number(),
  description: z.string().optional(),
});

type ProductForm = z.infer<typeof schema>;

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
  onUpdated?: () => void;
}

type Category = {
  id: number;
  name: string;
};

type NewImageItem = {
  file: File;
  preview: string;
};

export function EditProductModal({
  isOpen,
  onClose,
  productId,
  onUpdated,
}: EditProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<NewImageItem[]>([]);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "existing" | "new";
    index: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(schema),
  });

  const API_URL = "http://localhost:8000";

  /* -------------------------
        Charger catégories
  ---------------------------*/
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      setCategories(await res.json());
    } catch {
      toast.error("Impossible de charger les catégories");
    }
  };

  /* -------------------------
         Charger produit
  ---------------------------*/
  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/produits/${productId}`);
      const data = await res.json();

      reset({
        name: data.name,
        category: String(data.category_id),
        purchasePrice: Number(data.purchase_price),
        salePrice: Number(data.sale_price),
        quantity: Number(data.quantity),
        description: data.description ?? "",
      });

      // 🔥 data.images est déjà un tableau d'URL complètes
      setExistingImages(Array.isArray(data.images) ? data.images : []);

      setNewImages([]);
    } catch {
      toast.error("Erreur lors du chargement du produit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && productId) {
      fetchCategories();
      fetchProduct();
    }
  }, [isOpen, productId]);

  /* -------------------------
       Ajouter nouvelles images
  ---------------------------*/
  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...mapped]);
  };

  /* -------------------------
      Remplacement image exist.
  ---------------------------*/
  const handleReplaceExisting = (index: number, file: File) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));

    setNewImages((prev) => [
      ...prev,
      { file, preview: URL.createObjectURL(file) },
    ]);
  };

  /* -------------------------
        Confirmation delete
  ---------------------------*/
  const askDelete = (type: "existing" | "new", index: number) => {
    setDeleteTarget({ type, index });
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const { type, index } = deleteTarget;

    if (type === "existing") {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }

    setDeleteTarget(null);
    setConfirmDeleteOpen(false);
  };

  /* -------------------------
         SUBMIT
  ---------------------------*/
  const submit = async (data: ProductForm) => {
    if (!productId) return;

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", data.name);
    formData.append("category_id", data.category);
    formData.append("purchase_price", String(data.purchasePrice));
    formData.append("sale_price", String(data.salePrice));
    formData.append("quantity", String(data.quantity));
    formData.append("description", data.description || "");

    // 🔵 Garder images existantes
    existingImages.forEach((img) => formData.append("gallery[]", img));

    // 🟢 Ajouter nouvelles images
    newImages.forEach((item) => formData.append("images[]", item.file));

    try {
      const res = await fetch(`${API_URL}/api/produits/${productId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Produit mis à jour avec succès");
      onUpdated?.();
      onClose();
    } catch {
      toast.error("Erreur lors de la mise à jour du produit");
    }
  };

  if (loading) return null;

  /* -------------------------
         RENDER
  ---------------------------*/
  return (
    <>
      {/* MODAL EDIT */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Gérez les informations et la galerie d’images.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            
            {/* CHAMPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Nom *</Label>
                <Input {...register("name")} />
              </div>

              <div>
                <Label>Catégorie *</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label>Prix d'achat *</Label>
                <Input type="number" {...register("purchasePrice", { valueAsNumber: true })} />
              </div>

              <div>
                <Label>Prix de vente *</Label>
                <Input type="number" {...register("salePrice", { valueAsNumber: true })} />
              </div>

              <div>
                <Label>Quantité *</Label>
                <Input type="number" {...register("quantity", { valueAsNumber: true })} />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <Label>Description</Label>
              <Textarea {...register("description")} />
            </div>

            {/* IMAGES EXISTANTES */}
            <div className="space-y-4 border-t pt-4">
              <Label>Images existantes</Label>

              <div className="flex flex-wrap gap-4">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative group w-24 h-24">

                    <img
                      src={url} // 🔥 FIX — URL complète déjà OK
                      className="w-24 h-24 object-cover border rounded-md"
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      
                      {/* Replace */}
                      <label
                        htmlFor={`replace-${index}`}
                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full cursor-pointer"
                      >
                        <Pencil className="w-5 h-5 text-yellow-300" />
                      </label>

                      <input
                        id={`replace-${index}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReplaceExisting(index, file);
                        }}
                      />

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => askDelete("existing", index)}
                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full"
                      >
                        <Trash2 className="w-5 h-5 text-red-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NOUVELLES IMAGES */}
            <div className="space-y-4">
              <Label>Nouvelles images</Label>

              <div className="flex flex-wrap gap-4">
                {newImages.map((img, index) => (
                  <div key={index} className="relative group w-24 h-24">
                    <img
                      src={img.preview}
                      className="w-24 h-24 object-cover border rounded-md"
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => askDelete("new", index)}
                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full"
                      >
                        <Trash2 className="w-5 h-5 text-red-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryChange}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer l’image ?</DialogTitle>
            <DialogDescription>Action irréversible</DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Annuler
            </Button>

            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
