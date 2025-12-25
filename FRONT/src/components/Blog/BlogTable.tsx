import { useEffect, useState } from "react";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import AddBlogPostModal from "./AddBlogPostModal";
import type { BlogPost as FullBlogPost } from "@/types/blog";
import EditBlogPostModal from "./EditBlogPostModal";

// Type utilisé pour l’affichage rapide
type BlogPostSummary = {
  id: number;
  title: string;
  author: string;
  category: string;
  published_at: string | null;
};

/** ✅ API dynamique (local / prod) */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BlogTable = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<FullBlogPost | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // Charger tous les posts
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog-posts`);
      const data = await res.json();
      setPosts(data);
    } catch {
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  // Charger un seul post pour édition
  const fetchPostById = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog-posts/${id}`);
      const data = await res.json();
      setPostToEdit(data);
      setEditModalOpen(true);
    } catch {
      toast.error("Erreur lors du chargement de l'article");
    }
  };

  // Supprimer un post
  const handleDelete = async () => {
    if (!selectedPostId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/blog-posts/${selectedPostId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Article supprimé !");
      fetchPosts();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setConfirmDelete(false);
      setSelectedPostId(null);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Articles du Blog</h2>
        <Button onClick={() => setAddModalOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Ajouter un article
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Chargement...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">Aucun article trouvé.</p>
      ) : (
        <table className="w-full text-left border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border">Titre</th>
              <th className="px-4 py-2 border">Auteur</th>
              <th className="px-4 py-2 border">Catégorie</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{post.title}</td>
                <td className="px-4 py-2">{post.author}</td>
                <td className="px-4 py-2">{post.category}</td>
                <td className="px-4 py-2">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => fetchPostById(post.id)}
                    >
                      <Pencil className="w-4 h-4 text-yellow-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setSelectedPostId(post.id);
                        setConfirmDelete(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Édition */}
      {editModalOpen && postToEdit && (
        <EditBlogPostModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSuccess={() => {
            fetchPosts();
            setPostToEdit(null);
          }}
          blogPost={postToEdit}
        />
      )}

      {/* Modal Ajout */}
      {addModalOpen && (
        <AddBlogPostModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onSuccess={fetchPosts}
        />
      )}

      {/* Confirmation suppression */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Supprimer cet article ?
            </DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Voulez-vous vraiment continuer ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogTable;
