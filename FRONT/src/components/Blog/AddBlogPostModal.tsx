import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/* 🔽 Liste des catégories */
const uniqueCategories = [
  "Matériel BTP",
  "Guides & Conseil Pro",
  "Chantier & Sécurité",
  "Études de prix",
  "Construction & Gros œuvre",
  "Nouveaux produits",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

/** ✅ Base API dynamique (local / prod) */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AddBlogPostModal = ({
  open,
  onOpenChange,
  onSuccess,
}: Props) => {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    read_time: "",
    image: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      if (value.length >= 2) {
        const matches = uniqueCategories.filter((cat) =>
          cat.toLowerCase().startsWith(value.toLowerCase())
        );
        setCategorySuggestions(matches);
      } else {
        setCategorySuggestions([]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleQuillChange = (value: string) => {
    setForm((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/blog-posts`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Erreur serveur :", result);
        throw new Error("Erreur API");
      }

      toast.success("Article ajouté !");
      onOpenChange(false);
      onSuccess();

      // reset form
      setForm({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        read_time: "",
        image: null,
      });
      setCategorySuggestions([]);
    } catch {
      toast.error("Erreur lors de l’ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-visible">
        <DialogHeader>
          <DialogTitle>Ajouter un article de blog</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Titre + Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input name="title" value={form.title} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <div className="relative">
                <Input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {categorySuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-40 overflow-y-auto">
                    {categorySuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            category: suggestion,
                          }));
                          setCategorySuggestions([]);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Auteur + Temps de lecture */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Auteur</Label>
              <Input
                name="author"
                value={form.author}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="read_time">Temps de lecture</Label>
              <Input
  name="read_time"
  type="number"
  min={1}
  value={form.read_time}
  onChange={handleChange}
  placeholder="Ex: 5"
/>

            </div>
          </div>

          {/* Résumé */}
          <div>
            <Label htmlFor="excerpt">Résumé</Label>
            <Textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
            />
          </div>

          {/* Contenu */}
          <div>
            <Label>Contenu</Label>
            <ReactQuill
              value={form.content}
              onChange={handleQuillChange}
              theme="snow"
              placeholder="Rédige ton contenu ici..."
              style={{ height: "300px", marginBottom: "40px" }}
              className="react-quill-editor"
            />
          </div>

          {/* Image */}
          <div>
            <Label htmlFor="image">Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlogPostModal;
