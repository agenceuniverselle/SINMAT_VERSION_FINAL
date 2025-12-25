/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

/* ================= CONFIG ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= VALIDATION ================= */
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

/* ================= COMPONENT ================= */
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
  } = useForm<ProductForm>({
    resolver: zodResolver(schema),
  });

  /* ---------- FETCH CATEGORIES ---------- */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      setCategories(await res.json());
    } catch {
      toast.error("Impossible de charger les catégories");
    }
  };

  /* ---------- FETCH PRODUCT ---------- */
  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/produits/${productId}`);
      const data = await res.json();

      reset({
        name: data.name,
        category: String(data.category_id),
        purchasePrice: Number(data.purchase_price),
        salePrice: Number(data.sale_price),
        quantity: Number(data.quantity),
        description: data.description ?? "",
      });

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

  /* ---------- IMAGE HANDLING ---------- */
  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setNewImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleReplaceExisting = (index: number, file: File) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setNewImages((prev) => [
      ...prev,
      { file, preview: URL.createObjectURL(file) },
    ]);
  };

  const askDelete = (type: "existing" | "new", index: number) => {
    setDeleteTarget({ type, index });
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "existing") {
      setExistingImages((prev) => prev.filter((_, i) => i !== deleteTarget.index));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== deleteTarget.index));
    }

    setConfirmDeleteOpen(false);
    setDeleteTarget(null);
  };

  /* ---------- SUBMIT ---------- */
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

    existingImages.forEach((img) => formData.append("gallery[]", img));
    newImages.forEach((img) => formData.append("images[]", img.file));

    try {
      const res = await fetch(`${API_BASE_URL}/api/produits/${productId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Produit mis à jour");
      onUpdated?.();
      onClose();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (loading) return null;

  /* ================= RENDER ================= */
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Informations et images du produit
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(submit)} className="space-y-6">
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

            <div>
              <Label>Description</Label>
              <Textarea {...register("description")} />
            </div>

            {/* IMAGES */}
            <div className="space-y-4 border-t pt-4">
              <Label>Images</Label>

              <div className="flex flex-wrap gap-4">
                {[...existingImages, ...newImages.map((n) => n.preview)].map(
                  (img, index) => (
                    <div key={index} className="relative w-24 h-24 group">
                      <img src={img} className="w-24 h-24 object-cover rounded border" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            askDelete(index < existingImages.length ? "existing" : "new", index)
                          }
                        >
                          <Trash2 className="text-red-300" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              <Input type="file" multiple onChange={handleGalleryChange} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
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
