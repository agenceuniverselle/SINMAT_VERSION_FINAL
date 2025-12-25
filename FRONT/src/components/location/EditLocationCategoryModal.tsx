import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  categoryId: number;
  onUpdated: () => void;
}

/** ✅ URLs dynamiques */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

export default function EditLocationCategoryModal({
  open,
  onOpenChange,
  categoryId,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    label: "",
    value: "",
    icon: "",
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [removeIcon, setRemoveIcon] = useState(false);

  useEffect(() => {
    if (categoryId && open) {
      fetch(`${API_BASE_URL}/api/categories_location/${categoryId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            label: data.label,
            value: data.value,
            icon: data.icon || "",
          });
          setRemoveIcon(false);
          setIconFile(null);
        })
        .catch(() => toast.error("Erreur lors du chargement"));
    }
  }, [categoryId, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setIconFile(e.target.files[0]);
      setRemoveIcon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("label", form.label);
    formData.append("value", form.value);

    if (iconFile) {
      formData.append("icon", iconFile);
    }

    if (removeIcon) {
      formData.append("remove_icon", "true");
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/categories_location/${categoryId}`,
        {
          method: "POST",
          headers: {
            "X-HTTP-Method-Override": "PUT",
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Catégorie mise à jour");
      onUpdated();
      onOpenChange(false);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* IMAGE ACTUELLE */}
          {form.icon && !removeIcon && (
            <div className="relative w-32 h-32 border rounded-md overflow-hidden group">
              <img
                src={`${STORAGE_URL}/${form.icon}`}
                alt="Icône actuelle"
                className="w-full h-full object-contain"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => document.getElementById("icon")?.click()}
                >
                  ✏️
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, icon: "" }));
                    setIconFile(null);
                    setRemoveIcon(true);
                  }}
                >
                  🗑️
                </Button>
              </div>
            </div>
          )}

          {/* UPLOAD */}
          <div>
            <Label htmlFor="icon">Icône (image)</Label>
            <Input
              id="icon"
              name="icon"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <Label htmlFor="label">
              Nom affiché <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="label"
              name="label"
              value={form.label}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="value">
              Slug / Valeur unique <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="value"
              name="value"
              value={form.value}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
