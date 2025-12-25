/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ================= PROPS ================= */
interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
  onUpdated?: () => void;
}

/* ================= COMPONENT ================= */
export function EditCategoryModal({
  isOpen,
  onClose,
  categoryId,
  onUpdated,
}: EditCategoryModalProps) {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CATEGORY ================= */
  const fetchCategory = async () => {
    try {
      const res = await fetch(`${API}/api/categories/${categoryId}`);
      if (!res.ok) throw new Error();

      const data = await res.json();

      setName(data.name || "");
      setDescription(data.description || "");
      setIconPreview(
        data.icon ? `${API}/storage/${data.icon}` : null
      );
    } catch {
      toast.error("Impossible de charger la catégorie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchCategory();
    }
  }, [isOpen, categoryId]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", name);
    formData.append("description", description);

    if (iconFile) {
      formData.append("icon", iconFile);
    }

    try {
      const res = await fetch(`${API}/api/categories/${categoryId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Catégorie mise à jour");
      onUpdated?.();
      handleClose();
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  /* ================= CLOSE ================= */
  const handleClose = () => {
    setName("");
    setDescription("");
    setIconFile(null);
    setIconPreview(null);
    onClose();
  };

  if (loading) return null;

  /* ================= RENDER ================= */
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de cette catégorie.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">

          {/* NOM */}
          <div className="space-y-2">
            <Label>Nom *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de la catégorie"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optionnelle)"
            />
          </div>

          {/* ICÔNE */}
          <div className="space-y-2">
            <Label>Icône</Label>

            {iconPreview && (
              <img
                src={iconPreview}
                alt="Icône catégorie"
                className="w-24 h-24 border rounded object-contain mx-auto"
              />
            )}

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setIconFile(file);
                setIconPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
