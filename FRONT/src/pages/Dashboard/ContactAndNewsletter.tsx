/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Mail,
  MessageSquare
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { EditMessageModal } from "../Contact/EditMessageModal";
import { EditNewsletterModal } from "@/components/Newsletter/EditNewsletterModal";


export default function MessagesNewsletters() {
  const [activeTab, setActiveTab] = useState<"messages" | "newsletters">("messages");
  const [messages, setMessages] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<"message" | "newsletter" | null>(null);
  const [editMessage, setEditMessage] = useState<any>(null);
  const [editNewsletter, setEditNewsletter] = useState<any>(null);

  const fetchData = async () => {
    try {
      const resMessages = await fetch("http://localhost:8000/api/contact-messages");
      const messagesData = await resMessages.json();
      setMessages(messagesData);

      const resNewsletters = await fetch("http://localhost:8000/api/newsletter-subscribers");
      const newsletterData = await resNewsletters.json();
      setNewsletters(newsletterData);
    } catch (err) {
      toast.error("Erreur lors du chargement des données");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDeleteDialog = (item: any, type: "message" | "newsletter") => {
    setSelectedItem(item);
    setDeleteType(type);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!selectedItem || !deleteType) return;

    const endpoint =
      deleteType === "message"
        ? `http://localhost:8000/api/contact-messages/${selectedItem.id}`
        : `http://localhost:8000/api/newsletter-subscribers/${selectedItem.id}`;

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success(
        deleteType === "message"
          ? "Message supprimé"
          : "Abonné supprimé"
      );

      // 🧼 Nettoyage local
      if (deleteType === "message") {
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== selectedItem.id)
        );
      } else {
        setNewsletters((prev) =>
          prev.filter((nl) => nl.id !== selectedItem.id)
        );
      }
    } catch (error) {
      toast.error("Échec de la suppression");
      console.error(error);
    } finally {
      setConfirmDelete(false);
      setSelectedItem(null);
      setDeleteType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages & Newsletters</h1>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
          <Button
            variant={activeTab === "newsletters" ? "default" : "outline"}
            onClick={() => setActiveTab("newsletters")}
          >
            <Mail className="w-4 h-4 mr-2" />
            Newsletters
          </Button>
        </div>
      </div>

      {/* 🔹 Tableau des Messages */}
      {activeTab === "messages" && (
        <Card>
          <CardHeader>
            <CardTitle>Messages reçus via le formulaire</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg: any) => (
                  <TableRow key={msg.id}>
                    <TableCell>{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell>{msg.subject || "-"}</TableCell>
                    <TableCell>{msg.message}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
  variant="ghost"
  size="icon"
  onClick={() => setEditMessage(msg)}
>
  <Edit className="w-4 h-4 text-yellow-500" />
</Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(msg, "message")}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 🔹 Tableau des abonnés Newsletter */}
      {activeTab === "newsletters" && (
        <Card>
          <CardHeader>
            <CardTitle>Abonnés à la newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsletters.map((sub: any) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.email || "-"}</TableCell>
                    <TableCell>{sub.phone || "-"}</TableCell>
                    <TableCell>
                      {new Date(sub.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                       <Button
  variant="ghost"
  size="icon"
  onClick={() => setEditNewsletter(sub)}
>
  <Edit className="w-4 h-4 text-yellow-500" />
</Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(sub, "newsletter")}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
{/* ✏️ Modale d'édition de message */}
{editMessage && (
  <EditMessageModal
    open={!!editMessage}
    message={editMessage}
    onClose={() => setEditMessage(null)}
    onUpdated={fetchData}
  />
)}

{/* ✏️ Modale d'édition de newsletter */}
{editNewsletter && (
  <EditNewsletterModal
    open={!!editNewsletter}
    subscriber={editNewsletter}
    onClose={() => setEditNewsletter(null)}
    onUpdated={fetchData}
  />
)}

      {/* 🗑️ Dialog Confirmation Suppression */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 text-lg">
              Confirmation de suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>
                {deleteType === "message"
                  ? `le message de ${selectedItem?.name}`
                  : `l'abonné ${selectedItem?.email}`}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(false)}
            >
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
}
