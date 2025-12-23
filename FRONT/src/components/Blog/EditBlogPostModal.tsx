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

/* ✅ Liste des catégories */
const CATEGORIES = [
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "UPDATE_FIELD"; field: keyof BlogPostForm; value: any }
  | { type: "SET_NEW_IMAGE"; payload: File }
  | { type: "RESET" };

function formReducer(state: BlogPostForm | null, action: Action): BlogPostForm | null {
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

const EditBlogPostModal = ({ open, onOpenChange, onSuccess, blogPost }: Props) => {
  const [form, dispatch] = useReducer(formReducer, null);
  const [loading, setLoading] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);

  const quillRef = useRef<ReactQuill | null>(null);
  const contentBackupRef = useRef<string>("");

  useEffect(() => {
    if (open) {
      contentBackupRef.current = blogPost.content ?? "";

      dispatch({
        type: "SET_FORM",
        payload: {
          ...blogPost,
          content: blogPost.content ?? "",
          newImage: null,
          removeImage: false,
        },
      });
    }
  }, [open, blogPost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FIELD", field: name as keyof BlogPostForm, value });

    if (name === "category") {
      if (value.length >= 2) {
        const matches = CATEGORIES.filter((cat) =>
          cat.toLowerCase().startsWith(value.toLowerCase())
        );
        setCategorySuggestions(matches);
      } else {
        setCategorySuggestions([]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch({ type: "SET_NEW_IMAGE", payload: file });
      dispatch({ type: "UPDATE_FIELD", field: "removeImage", value: false });
    }
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

  const handleSubmit = async () => {
    if (!form) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("excerpt", form.excerpt);
    formData.append("content", form.content ?? contentBackupRef.current);
    formData.append("category", form.category);
    formData.append("author", form.author);
    formData.append("read_time", form.read_time);

    if (form.newImage) {
      formData.append("image", form.newImage);
    }

    if (form.removeImage) {
      formData.append("remove_image", "1");
    }

    formData.append("_method", "PUT");

    try {
      const res = await fetch(`http://localhost:8000/api/blog-posts/${form.id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erreur backend :", data);
        throw new Error("Erreur mise à jour");
      }

      toast.success("Article mis à jour !");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        key="edit-blog-modal"
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Modifier l'article</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-left pb-6">
          {/* TITLE + CATEGORY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" value={form.title} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <div className="relative">
                <Input
                  id="category"
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
                          dispatch({
                            type: "UPDATE_FIELD",
                            field: "category",
                            value: suggestion,
                          });
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

          {/* AUTHOR + READ TIME */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Auteur</Label>
              <Input id="author" name="author" value={form.author} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="read_time">Temps de lecture</Label>
              <Input id="read_time" name="read_time" value={form.read_time} onChange={handleChange} />
            </div>
          </div>

          {/* EXCERPT */}
          <div>
            <Label htmlFor="excerpt">Résumé</Label>
            <Textarea id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} />
          </div>

          {/* CONTENT */}
          <div>
            <Label>Contenu</Label>
            <ReactQuill
              ref={quillRef}
              value={form.content ?? contentBackupRef.current}
              onChange={handleQuillChange}
              theme="snow"
              style={{ height: "300px", marginBottom: "40px" }}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ align: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={[
                "header", "bold", "italic", "underline", "strike",
                "color", "background", "align",
                "list", "bullet", "link", "image",
              ]}
            />
          </div>

          {/* IMAGE */}
          <div>
            <Label>Image principale</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />

            {(form.image || form.newImage) && (
              <div className="relative mt-3 group w-fit">
                <img
                  src={
                    form.newImage
                      ? URL.createObjectURL(form.newImage)
                      : `http://localhost:8000/storage/${form.image}`
                  }
                  alt="Image preview"
                  className="w-32 h-20 object-cover rounded border"
                />

                <div
                  className="
                    absolute inset-0 
                    bg-black/40 
                    opacity-0 group-hover:opacity-100 
                    flex items-center justify-center gap-3 
                    transition-opacity rounded
                  "
                >
                  <button
                    type="button"
                    className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 text-xs rounded"
                    onClick={() => {
                      document.getElementById("image")?.click();
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 text-xs rounded"
                    onClick={handleDeleteImage}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <Button disabled={loading} onClick={handleSubmit} className="w-full">
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogPostModal;
