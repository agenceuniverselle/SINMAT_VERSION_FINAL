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

// 📌 VALIDATION ZOD (SEULEMENT AJOUT DE STATUS)
const productSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis").max(100),
  category: z.string().min(1, "La catégorie est requise"),
  purchasePrice: z.number().min(0, "Le prix d'achat doit être positif"),
  salePrice: z.number().min(0, "Le prix de vente doit être positif"),
  quantity: z.number().int().min(0, "La quantité doit être positive"),
  status: z.string().optional(), // ✅ AJOUT DU STATUT
  description: z.string().max(500).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ---------------------------
   ADD PRODUCT MODAL
---------------------------- */
export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const API = "http://localhost:8000";

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { category: "", status: "" },
  });

  /* FETCH CATEGORIES */
  useEffect(() => {
    if (!isOpen) return;

    fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => toast.error("Impossible de charger les catégories"));
  }, [isOpen]);

  /* IMAGE UPLOAD */
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

  /* SUBMIT */
  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category_id", data.category);
      formData.append("purchase_price", String(data.purchasePrice));
      formData.append("sale_price", String(data.salePrice));
      formData.append("quantity", String(data.quantity));
      formData.append("description", data.description || "");

      // ⭐ AJOUT DU STATUT DANS L'API
      if (data.status) {
        formData.append("status", data.status);
      }

      imageFiles.forEach((file) => formData.append("images[]", file));
console.log("🔍 Données envoyées :", {
  name: data.name,
  category_id: data.category,
  purchase_price: data.purchasePrice,
  sale_price: data.salePrice,
  quantity: data.quantity,
  status: data.status,
  description: data.description,
});

      const res = await fetch(`${API}/api/produits`, {
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

  /* CLOSE */
  const handleClose = () => {
    reset();
    setImageFiles([]);
    setImagePreviews([]);
    onClose();
  };

  /* RENDER */
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>Remplissez les informations du produit.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NOM */}
            <div className="space-y-2">
              <Label>Nom du produit <span className="text-red-500">*</span></Label>
              <Input {...register("name")} placeholder="Ex: Perceuse électrique" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            {/* CATÉGORIE */}
            <div className="space-y-2">
              <Label>Catégorie <span className="text-red-500">*</span></Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <div key={cat.id}>
                          <SelectItem value={String(cat.id)} className="font-medium">
                            {cat.name}
                          </SelectItem>

                          {cat.children?.map((sub: any) => (
                            <SelectItem
                              key={sub.id}
                              value={String(sub.id)}
                              className="text-gray-600 pl-8"
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
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            {/* PRIX D'ACHAT */}
            <div className="space-y-2">
              <Label>Prix d'achat <span className="text-red-500">*</span></Label>
              <Input type="number" step="0.01" {...register("purchasePrice", { valueAsNumber: true })} />
            </div>

            {/* PRIX DE VENTE */}
            <div className="space-y-2">
              <Label>Prix de vente <span className="text-red-500">*</span></Label>
              <Input type="number" step="0.01" {...register("salePrice", { valueAsNumber: true })} />
            </div>

            {/* QUANTITÉ */}
            <div className="space-y-2">
              <Label>Quantité <span className="text-red-500">*</span></Label>
              <Input type="number" {...register("quantity", { valueAsNumber: true })} />
            </div>

            {/* ⭐ STATUT (AJOUTÉ) */}
            <div className="space-y-2">
              <Label>Statut du produit <span className="text-red-500">*</span></Label>

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
            <Textarea {...register("description")} className="min-h-[100px]" />
          </div>

          {/* IMAGES */}
          <div className="space-y-2">
            <Label>Images</Label>

            <div className="border-2 border-dashed rounded-xl p-6">
              <label htmlFor="images" className="flex flex-col items-center cursor-pointer">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <span className="text-sm">Cliquez pour importer</span>
                <Input id="images" type="file" multiple className="hidden" onChange={handleImageChange} />
              </label>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img src={src} className="w-full h-32 object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreviews((prev) => prev.filter((_, i) => i !== index));
                          setImageFiles((prev) => prev.filter((_, i) => i !== index));
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
