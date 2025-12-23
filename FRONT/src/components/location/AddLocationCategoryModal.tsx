import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddLocationCategoryModal = ({ open, onOpenChange, onSuccess }: Props) => {
  const [form, setForm] = useState({ label: "", value: "" });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIconFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("label", form.label);
    formData.append("value", form.value);
    if (iconFile) {
      formData.append("icon", iconFile);
    }

const res = await fetch("http://localhost:8000/api/categories_location", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setForm({ label: "", value: "" });
      setIconFile(null);
      onOpenChange(false);
      onSuccess();
    } else {
      const data = await res.json();
      setErrors(data.errors || {});
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une catégorie</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="label">Nom du catégorie<span className="text-orange-500 ml-1">*</span></Label>
            <Input
              id="label"
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Ex : Mini-pelles"
            />
            {errors.label && (
              <p className="text-red-500 text-xs mt-1">{errors.label[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="value">Description</Label>
            <Input
              id="value"
              name="value"
              value={form.value}
              onChange={handleChange}
              placeholder="ex: excavation"
            />
            {errors.value && (
              <p className="text-red-500 text-xs mt-1">{errors.value[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="icon">Icône (image)</Label>
            <Input
              id="icon"
              name="icon"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.icon && (
              <p className="text-red-500 text-xs mt-1">{errors.icon[0]}</p>
            )}
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationCategoryModal;
