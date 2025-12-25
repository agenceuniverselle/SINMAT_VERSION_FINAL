/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, ImageIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/* ================= CONFIG ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= VALIDATION ================= */
const productSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis").max(100),
  category: z.string().min(1, "La catégorie est requise"),
  purchasePrice: z.number().min(0, "Le prix d'achat doit être positif"),
  salePrice: z.number().min(0, "Le prix de vente doit être positif"),
  quantity: z.number().int().min(0, "La quantité doit être positive"),
  status: z.string().optional(),
  description: z.string().max(500).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ================= COMPONENT ================= */
export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [categories, setCategories] = useState<{ id: string; name: string; children?: any[] }[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "",
      status: "",
    },
  });

  /* ---------- FETCH CATEGORIES ---------- */
  useEffect(() => {
    if (!isOpen) return;

    fetch(`${API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => toast.error("Impossible de charger les catégories"));
  }, [isOpen]);

  /* ---------- IMAGE UPLOAD ---------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...files]);
  };

  /* ---------- SUBMIT ---------- */
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category_id", data.category);
      formData.append("purchase_price", String(data.purchasePrice));
      formData.append("sale_price", String(data.salePrice));
      formData.append("quantity", String(data.quantity));
      formData.append("description", data.description || "");

      if (data.status) {
        formData.append("status", data.status);
      }

      imageFiles.forEach((file) => formData.append("images[]", file));

      const res = await fetch(`${API_BASE_URL}/api/produits`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Produit ajouté avec succès !");
      handleClose();
    } catch {
      toast.error("Erreur lors de l'ajout du produit");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- CLOSE ---------- */
  const handleClose = () => {
    reset();
    setImageFiles([]);
    setImagePreviews([]);
    onClose();
  };

  /* ================= RENDER ================= */
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations du produit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NOM */}
            <div className="space-y-2">
              <Label>Nom du produit *</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* CATÉGORIE */}
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <div key={cat.id}>
                          <SelectItem value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                          {cat.children?.map((sub) => (
                            <SelectItem
                              key={sub.id}
                              value={String(sub.id)}
                              className="pl-8 text-muted-foreground"
                            >
                              {cat.name} → {sub.name}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* PRIX */}
            <div className="space-y-2">
              <Label>Prix d'achat *</Label>
              <Input type="number" step="0.01" {...register("purchasePrice", { valueAsNumber: true })} />
            </div>

            <div className="space-y-2">
              <Label>Prix de vente *</Label>
              <Input type="number" step="0.01" {...register("salePrice", { valueAsNumber: true })} />
            </div>

            {/* QUANTITÉ */}
            <div className="space-y-2">
              <Label>Quantité *</Label>
              <Input type="number" {...register("quantity", { valueAsNumber: true })} />
            </div>

            {/* STATUT */}
            <div className="space-y-2">
              <Label>Statut</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotion">En promotion</SelectItem>
                      <SelectItem value="nouveaute">Nouveauté</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} />
          </div>

          {/* IMAGES */}
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="border-2 border-dashed rounded-xl p-6">
              <label className="flex flex-col items-center cursor-pointer">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <span className="text-sm">Cliquez pour importer</span>
                <Input type="file" multiple className="hidden" onChange={handleImageChange} />
              </label>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} className="w-full h-32 object-cover rounded-lg" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreviews((p) => p.filter((_, x) => x !== i));
                          setImageFiles((p) => p.filter((_, x) => x !== i));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter le produit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
