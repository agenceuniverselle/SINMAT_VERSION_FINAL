import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Category = {
  id: number;
  label: string;
};

/** ✅ API dynamique */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AddLocationProductModal = ({
  open,
  onOpenChange,
  onSuccess,
}: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
    category_id: "",
    status: "disponible",
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);

  // 🔽 Charger les catégories
  useEffect(() => {
    if (open) {
      fetch(`${API_BASE_URL}/categories_location`)
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch(() =>
          toast.error("Erreur chargement des catégories")
        );
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("title", form.name);
    formData.append("description", form.description);
    formData.append("price_per_day", form.price);
    formData.append("location_category_id", form.category_id);
    formData.append("status", form.status);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/produits_location`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Produit ajouté");
        setForm({
          name: "",
          description: "",
          price: "",
          image: null,
          category_id: "",
          status: "disponible",
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error("Erreur lors de l’ajout");
        setErrors(data.errors || {});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un produit de location</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Pelle mécanique"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Courte description"
              className="h-16 text-base"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="price">
              Prix journalier (MAD){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Ex: 120"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price[0]}
              </p>
            )}
          </div>

          {/* Catégorie */}
          <div>
            <Label htmlFor="category_id">
              Catégorie <span className="text-red-500">*</span>
            </Label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="">Choisir une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category_id[0]}
              </p>
            )}
          </div>

          {/* Statut */}
          <div>
            <Label htmlFor="status">
              Statut du produit{" "}
              <span className="text-red-500">*</span>
            </Label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="disponible">Disponible</option>
              <option value="sur_commande">Sur commande</option>
              <option value="non_disponible">Non disponible</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">
                {errors.status[0]}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">
                {errors.image[0]}
              </p>
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

export default AddLocationProductModal;
