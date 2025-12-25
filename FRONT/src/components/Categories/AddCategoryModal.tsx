/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { toast } from "sonner";

/* ================= VALIDATION ================= */
const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  icon: z.instanceof(File, { message: "Icône requise" }),
  subcategories: z.array(z.string()).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

/* ================= COMPONENT ================= */
export function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  /* ================= RESET ================= */
  const handleClose = () => {
    reset();
    setSubcategories([]);
    setIconPreview(null);
    onClose();
  };

  /* ================= SUBCATEGORIES ================= */
  const addSubcategory = () => {
    setSubcategories((prev) => [...prev, ""]);
  };

  const updateSubcategory = (index: number, value: string) => {
    const updated = [...subcategories];
    updated[index] = value;
    setSubcategories(updated);
  };

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("icon", data.icon);

      subcategories
        .filter((s) => s.trim() !== "")
        .forEach((sub) => {
          formData.append("subcategories[]", sub);
        });

      const res = await fetch(`${API}/api/categories`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Catégorie créée avec succès");
      onSubmit?.();
      handleClose();
    } catch {
      toast.error("Erreur lors de la création de la catégorie");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-[95%] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Ajouter une catégorie
          </DialogTitle>
          <DialogDescription>
            Créez une catégorie et ses sous-catégories.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 mt-4"
        >
          {/* NOM */}
          <div className="space-y-2">
            <Label>
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("name")}
              placeholder="Ex : Plomberie"
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* SOUS-CATÉGORIES */}
          <div className="space-y-3">
            {subcategories.map((sub, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={sub}
                  onChange={(e) =>
                    updateSubcategory(index, e.target.value)
                  }
                  placeholder={`Sous-catégorie ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeSubcategory(index)}
                >
                  X
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addSubcategory}>
              + Ajouter une sous-catégorie
            </Button>
          </div>

          {/* ICÔNE */}
          <div className="space-y-2">
            <Label>
              Icône <span className="text-red-500">*</span>
            </Label>

            <label className="w-full h-32 border border-dashed rounded-md flex flex-col justify-center items-center cursor-pointer">
              {iconPreview ? (
                <img
                  src={iconPreview}
                  alt="Icône"
                  className="h-20 w-20 object-contain"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  Cliquez pour importer
                </span>
              )}

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setIconPreview(URL.createObjectURL(file));
                  setValue("icon", file);
                }}
              />
            </label>

            {errors.icon && (
              <p className="text-sm text-destructive">
                {errors.icon.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              className="min-h-[100px]"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
