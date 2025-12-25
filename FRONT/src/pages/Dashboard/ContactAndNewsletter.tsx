/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Mail, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { EditMessageModal } from "../Contact/EditMessageModal";
import { EditNewsletterModal } from "@/components/Newsletter/EditNewsletterModal";

/* ✅ API centralisée */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MessagesNewsletters() {
  const [activeTab, setActiveTab] = useState<"messages" | "newsletters">(
    "messages"
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<
    "message" | "newsletter" | null
  >(null);

  const [editMessage, setEditMessage] = useState<any>(null);
  const [editNewsletter, setEditNewsletter] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [resMessages, resNewsletters] = await Promise.all([
        fetch(`${API_BASE_URL}/contact-messages`),
        fetch(`${API_BASE_URL}/newsletter-subscribers`),
      ]);

      if (!resMessages.ok || !resNewsletters.ok) {
        throw new Error();
      }

      setMessages(await resMessages.json());
      setNewsletters(await resNewsletters.json());
    } catch (err) {
      toast.error("Erreur lors du chargement des données");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDeleteDialog = (
    item: any,
    type: "message" | "newsletter"
  ) => {
    setSelectedItem(item);
    setDeleteType(type);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!selectedItem || !deleteType) return;

    const endpoint =
      deleteType === "message"
        ? `${API_BASE_URL}/contact-messages/${selectedItem.id}`
        : `${API_BASE_URL}/newsletter-subscribers/${selectedItem.id}`;

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error();

      toast.success(
        deleteType === "message"
          ? "Message supprimé"
          : "Abonné supprimé"
      );

      if (deleteType === "message") {
        setMessages((prev) =>
          prev.filter((m) => m.id !== selectedItem.id)
        );
      } else {
        setNewsletters((prev) =>
          prev.filter((n) => n.id !== selectedItem.id)
        );
      }
    } catch (err) {
      toast.error("Échec de la suppression");
      console.error(err);
    } finally {
      setConfirmDelete(false);
      setSelectedItem(null);
      setDeleteType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Messages & Newsletters
        </h1>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>

          <Button
            variant={
              activeTab === "newsletters" ? "default" : "outline"
            }
            onClick={() => setActiveTab("newsletters")}
          >
            <Mail className="w-4 h-4 mr-2" />
            Newsletters
          </Button>
        </div>
      </div>

      {/* MESSAGES */}
      {activeTab === "messages" && (
        <Card>
          <CardHeader>
            <CardTitle>Messages reçus</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell>{msg.subject || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {msg.message}
                    </TableCell>
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
                          onClick={() =>
                            openDeleteDialog(msg, "message")
                          }
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

      {/* NEWSLETTERS */}
      {activeTab === "newsletters" && (
        <Card>
          <CardHeader>
            <CardTitle>Abonnés Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsletters.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.email || "-"}</TableCell>
                    <TableCell>{sub.phone || "-"}</TableCell>
                    <TableCell>
                      {new Date(sub.created_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setEditNewsletter(sub)
                          }
                        >
                          <Edit className="w-4 h-4 text-yellow-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            openDeleteDialog(sub, "newsletter")
                          }
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

      {/* MODALS */}
      {editMessage && (
        <EditMessageModal
          open
          message={editMessage}
          onClose={() => setEditMessage(null)}
          onUpdated={fetchData}
        />
      )}

      {editNewsletter && (
        <EditNewsletterModal
          open
          subscriber={editNewsletter}
          onClose={() => setEditNewsletter(null)}
          onUpdated={fetchData}
        />
      )}

      {/* DELETE CONFIRM */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Confirmation de suppression
            </DialogTitle>
            <DialogDescription>
              Supprimer{" "}
              <strong>
                {deleteType === "message"
                  ? `le message de ${selectedItem?.name}`
                  : `l’abonné ${selectedItem?.email}`}
              </strong>{" "}
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
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
