import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
  productId: number | null;
}

type Category = {
  id: number;
  label: string;
};

export const EditLocationProductModal = ({
  open,
  onOpenChange,
  onUpdated,
  productId,
}: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
    category_id: "",
    status: "disponible",
    remove_image: false,
  });

  useEffect(() => {
    if (open) {
      fetch("http://localhost:8000/api/categories_location")
        .then((res) => res.json())
        .then(setCategories)
        .catch(() => toast.error("Erreur chargement des catégories"));
    }
  }, [open]);

  useEffect(() => {
    if (open && productId) {
      fetch(`http://localhost:8000/api/produits_location/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            name: data.title || "",
            description: data.description || "",
            price: data.price_per_day?.toString() || "",
            category_id: data.location_category_id?.toString() || "",
            status: data.status || "disponible",
            image: null,
            remove_image: false,
          });

          setImageUrl(data.image ? `http://localhost:8000/storage/${data.image}` : null);
        })
        .catch(() => toast.error("Erreur lors du chargement du produit"));
    }
  }, [open, productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setForm((prev) => ({
        ...prev,
        image: file,
        remove_image: false, // reset si l'utilisateur choisit une nouvelle image
      }));
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageEdit = () => {
    fileInputRef.current?.click();
  };

  const handleImageDelete = () => {
    setForm((prev) => ({ ...prev, image: null, remove_image: true }));
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input file
    }
  };

  const handleSubmit = async () => {
    if (!productId) return;

    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("title", form.name);
    formData.append("description", form.description);
    formData.append("price_per_day", form.price);
    formData.append("location_category_id", form.category_id);
    formData.append("status", form.status);
    formData.append("remove_image", form.remove_image ? "1" : "0");

    if (form.image) {
      formData.append("image", form.image);
    }

    formData.append("_method", "PUT");

    const res = await fetch(`http://localhost:8000/api/produits_location/${productId}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Produit mis à jour");
      onOpenChange(false);
      onUpdated();
    } else {
      toast.error("Erreur lors de la mise à jour");
      setErrors(data.errors || {});
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nom */}
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nom du produit"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="h-16 text-base"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
          </div>

          {/* Prix */}
          <div>
            <Label htmlFor="price">Prix journalier (MAD)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Ex: 120"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price[0]}</p>}
          </div>

          {/* Catégorie */}
          <div>
            <Label htmlFor="category_id">Catégorie</Label>
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
            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id[0]}</p>}
          </div>

          {/* Statut */}
          <div>
            <Label htmlFor="status">Statut</Label>
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
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
          </div>

          {/* Image */}
          <div>
            <Label>Image</Label>

            {imageUrl ? (
              <div className="relative w-40 h-40 rounded-md border overflow-hidden group">
                <img src={imageUrl} alt="Produit" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={handleImageEdit}
                    type="button"
                    className="bg-white p-1 rounded-full hover:bg-gray-200"
                    title="Modifier l'image"
                  >
                    <Pencil className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    onClick={handleImageDelete}
                    type="button"
                    className="bg-white p-1 rounded-full hover:bg-gray-200"
                    title="Supprimer l'image"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button type="button" onClick={handleImageEdit} variant="outline">
                  <Pencil className="w-4 h-4 mr-2" />
                  Importer une image
                </Button>
              </div>
            )}

            {/* Input caché */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Soumettre */}
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLocationProductModal;
