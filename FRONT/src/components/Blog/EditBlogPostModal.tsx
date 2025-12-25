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

/* ✅ Catégories */
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

/** ✅ URLs dynamiques */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    formData.append("_method", "PUT");

    if (form.newImage) formData.append("image", form.newImage);
    if (form.removeImage) formData.append("remove_image", "1");

    try {
      const res = await fetch(
        `${API_BASE_URL}/blog-posts/${form.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Erreur backend :", data);
        throw new Error();
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'article</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pb-6">
          {/* IMAGE */}
          {(form.image || form.newImage) && (
            <div className="relative mt-3 group w-fit">
              <img
                src={
                  form.newImage
                    ? URL.createObjectURL(form.newImage)
                    : `${APP_BASE_URL}/storage/${form.image}`
                }
                alt="Image preview"
                className="w-32 h-20 object-cover rounded border"
              />
            </div>
          )}

          <Button disabled={loading} onClick={handleSubmit} className="w-full">
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogPostModal;
