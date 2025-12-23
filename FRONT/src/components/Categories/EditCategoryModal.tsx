/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
  onUpdated?: () => void;
}

export function EditCategoryModal({
  isOpen,
  onClose,
  categoryId,
  onUpdated,
}: EditCategoryModalProps) {
  const API = "http://localhost:8000";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  // 📌 Charger les données de la catégorie
  const fetchCategory = async () => {
    try {
      const res = await fetch(`${API}/api/categories/${categoryId}`);
      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();

      setName(data.name);
      setDescription(data.description || "");
      setIconPreview(`${API}/storage/${data.icon}`);
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

  // 📌 Enregistrement des modifications
  const handleSave = async () => {
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

      if (onUpdated) onUpdated();
      onClose();
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  if (loading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Label>Nom</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ICÔNE */}
          <div className="space-y-2">
            <Label>Icône (PNG, SVG, JPG…)</Label>

            {iconPreview && (
              <img
                src={iconPreview}
                alt="Aperçu de l'icône"
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
                setIconPreview(URL.createObjectURL(file)); // aperçu instantané
              }}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>

            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
