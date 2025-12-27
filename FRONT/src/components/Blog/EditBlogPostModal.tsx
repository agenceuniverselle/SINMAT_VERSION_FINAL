/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReducer, useRef, useEffect, useState } from "react";
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
import type { BlogPost } from "@/types/blog";

/* ================= CATEGORIES ================= */
const CATEGORIES = [
  "Matériel BTP",
  "Guides & Conseil Pro",
  "Chantier & Sécurité",
  "Études de prix",
  "Construction & Gros œuvre",
  "Nouveaux produits",
];

/* ================= ENV ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  blogPost: BlogPost;
}

type BlogPostForm = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  image: string | null;
  newImage: File | null;
  removeImage: boolean;
};

type Action =
  | { type: "SET_FORM"; payload: BlogPostForm }
  | { type: "UPDATE_FIELD"; field: keyof BlogPostForm; value: any }
  | { type: "SET_NEW_IMAGE"; payload: File }
  | { type: "RESET" };

/* ================= REDUCER ================= */
function formReducer(
  state: BlogPostForm | null,
  action: Action
): BlogPostForm | null {
  switch (action.type) {
    case "SET_FORM":
      return action.payload;
    case "UPDATE_FIELD":
      if (!state) return state;
      return { ...state, [action.field]: action.value };
    case "SET_NEW_IMAGE":
      if (!state) return state;
      return { ...state, newImage: action.payload, removeImage: false };
    case "RESET":
      return null;
    default:
      return state;
  }
}

/* ================= HELPERS ================= */
const resolveImageUrl = (img?: string | null) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `${API_BASE_URL}/storage/${img}`;
};

/* ================= COMPONENT ================= */
const EditBlogPostModal = ({
  open,
  onOpenChange,
  onSuccess,
  blogPost,
}: Props) => {
  const [form, dispatch] = useReducer(formReducer, null);
  const [loading, setLoading] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);

  const quillRef = useRef<ReactQuill | null>(null);
  const contentBackupRef = useRef<string>("");

  /* ---------- INIT ---------- */
  useEffect(() => {
    if (open) {
      contentBackupRef.current = blogPost.content ?? "";

      dispatch({
        type: "SET_FORM",
        payload: {
          id: blogPost.id,
          title: blogPost.title ?? "",
          excerpt: blogPost.excerpt ?? "",
          content: blogPost.content ?? "",
          category: blogPost.category ?? "",
          author: blogPost.author ?? "",
          read_time: blogPost.read_time ?? "",
          image: blogPost.image ?? null,
          newImage: null,
          removeImage: false,
        },
      });
    }
  }, [open, blogPost]);

  /* ---------- HANDLERS ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FIELD", field: name as any, value });

    if (name === "category") {
      if (value.length >= 2) {
        setCategorySuggestions(
          CATEGORIES.filter((c) =>
            c.toLowerCase().startsWith(value.toLowerCase())
          )
        );
      } else {
        setCategorySuggestions([]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch({ type: "SET_NEW_IMAGE", payload: file });
  };

  const handleDeleteImage = () => {
    dispatch({ type: "UPDATE_FIELD", field: "image", value: null });
    dispatch({ type: "UPDATE_FIELD", field: "newImage", value: null });
    dispatch({ type: "UPDATE_FIELD", field: "removeImage", value: true });
  };

  const handleQuillChange = (value: string) => {
    contentBackupRef.current = value;
    dispatch({ type: "UPDATE_FIELD", field: "content", value });
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!form) return;

    setLoading(true);
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("excerpt", form.excerpt);
    formData.append("content", form.content || contentBackupRef.current);
    formData.append("category", form.category);
    formData.append("author", form.author);
    formData.append("read_time", form.read_time);
    formData.append("_method", "PUT");

    if (form.newImage) formData.append("image", form.newImage);
    if (form.removeImage) formData.append("remove_image", "1");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/blog-posts/${form.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Article mis à jour");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return null;

  /* ================= RENDER ================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Modifier l’article</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pb-6">
          {/* TITLE + CATEGORY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Titre</Label>
              <Input name="title" value={form.title} onChange={handleChange} />
            </div>

            <div className="relative">
              <Label>Catégorie</Label>
              <Input
                name="category"
                value={form.category}
                onChange={handleChange}
                autoComplete="off"
              />
              {categorySuggestions.length > 0 && (
                <ul className="absolute z-20 bg-white border rounded shadow w-full mt-1">
                  {categorySuggestions.map((cat) => (
                    <li
                      key={cat}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        dispatch({
                          type: "UPDATE_FIELD",
                          field: "category",
                          value: cat,
                        });
                        setCategorySuggestions([]);
                      }}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* AUTHOR + READ TIME */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Auteur</Label>
              <Input
                name="author"
                value={form.author}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Temps de lecture</Label>
              <Input
                name="read_time"
                value={form.read_time}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* EXCERPT */}
          <div>
            <Label>Résumé</Label>
            <Textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
            />
          </div>

          {/* CONTENT */}
          <div>
            <Label>Contenu</Label>
            <ReactQuill
              ref={quillRef}
              value={form.content}
              onChange={handleQuillChange}
              theme="snow"
              style={{ height: 300, marginBottom: 40 }}
            />
          </div>

          {/* IMAGE */}
          <div>
            <Label>Image principale</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />

            {(form.image || form.newImage) && (
              <div className="relative mt-3 group w-fit">
                <img
                  src={
                    form.newImage
                      ? URL.createObjectURL(form.newImage)
                      : resolveImageUrl(form.image)
                  }
                  className="w-32 h-20 object-cover rounded border"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 rounded">
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
                    onClick={() =>
                      document.querySelector<HTMLInputElement>(
                        'input[type="file"]'
                      )?.click()
                    }
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                    onClick={handleDeleteImage}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogPostModal;
