/* eslint-disable @typescript-eslint/no-explicit-any */
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

// ⭐ VALIDATION
const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  icon: z.any().refine((file) => file instanceof File, "Icône requise"),
  subcategories: z.array(z.string()).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  const API = "http://localhost:8000";

  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // Reset
  const handleClose = () => {
    reset();
    setSubcategories([]);
    setIconPreview(null);
    onClose();
  };

  // Add subcategory
  const addSubcategory = () => {
    setSubcategories((prev) => [...prev, ""]);
  };

  // Edit
  const updateSubcategory = (i: number, value: string) => {
    const updated = [...subcategories];
    updated[i] = value;
    setSubcategories(updated);
  };

  // Remove
  const removeSubcategory = (i: number) => {
    setSubcategories(subcategories.filter((_, index) => index !== i));
  };

  // Submit
  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("icon", data.icon);

      subcategories.forEach((sub) => {
        formData.append("subcategories[]", sub);
      });

      const res = await fetch(`${API}/api/categories`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l’ajout");

      toast.success("Catégorie créée avec succès");

      if (onSubmit) onSubmit();
      handleClose();
    } catch (err: any) {
      toast.error("Erreur", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg w-[95%] sm:w-full max-h-[90vh] overflow-y-auto rounded-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
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
            <Label>Nom de la catégorie <span className="text-red-500">*</span></Label>
            <Input
              {...register("name")}
              placeholder="Ex : Plomberie"
              className="h-11 w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* SOUS CAT */}
          <div className="space-y-3">

            {subcategories.map((sub, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                <Input
                  value={sub}
                  onChange={(e) => updateSubcategory(index, e.target.value)}
                  placeholder={`Sous-catégorie ${index + 1}`}
                  className="h-11 flex-1"
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
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

          {/* ICON */}
          <div className="space-y-2">
            <Label>Icône <span className="text-red-500">*</span></Label>

            <label
              htmlFor="icon"
              className="w-full h-32 border border-dashed rounded-md flex flex-col justify-center items-center cursor-pointer bg-white"
            >
              {iconPreview ? (
                <img
                  src={iconPreview}
                  className="h-20 w-20 object-contain mx-auto"
                />
              ) : (
                <p className="text-gray-500 text-sm">
                  Cliquez pour importer
                </p>
              )}

              <Input
                id="icon"
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
              <p className="text-red-500 text-sm">{errors.icon.message}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              className="min-h-[100px] w-full"
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
