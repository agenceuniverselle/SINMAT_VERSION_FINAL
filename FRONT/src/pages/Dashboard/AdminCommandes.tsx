/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

/* ✅ API centralisée */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminCommandes() {
  const [orders, setOrders] = useState<any[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [editOrder, setEditOrder] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const STATUSES = [
    "en attente",
    "en cours",
    "expédiée",
    "livrée",
    "annulée",
  ];

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/commandes`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("Erreur lors du chargement des commandes");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async () => {
    if (!selectedOrder) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/commandes/${selectedOrder.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      toast.success("Commande supprimée");
      setOrders((prev) =>
        prev.filter((order) => order.id !== selectedOrder.id)
      );
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setConfirmDelete(false);
      setSelectedOrder(null);
    }
  };

  /** FORM DATA pour gérer les champs d’édition sans override complet d’order */
  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "",
  });

  // initialiser formData quand editOrder change
  useEffect(() => {
    if (editOrder) {
      setFormData({
        name: editOrder.name || "",
        phone: editOrder.phone || "",
        email: editOrder.email || "",
        address: editOrder.address || "",
        status: editOrder.status || STATUSES[0],
      });
    }
  }, [editOrder]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/commandes/${editOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("Commande mise à jour !");
      setIsEditOpen(false);
      fetchOrders();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Commandes des ventes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Coordonnées</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.name}</TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    <div className="font-medium text-black">{order.phone}</div>
                    <div>{order.email}</div>
                    <div className="text-xs">{order.address}</div>
                  </TableCell>

                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>

                  <TableCell>
                    <span className="capitalize px-2 py-1 rounded bg-gray-100 text-sm">
                      {order.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setOrderDetails(order);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditOrder(order);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 text-yellow-500" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order);
                          setConfirmDelete(true);
                        }}
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

      {/* 👁️ MODAL DÉTAILS */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
            <DialogDescription>
              Commande de <strong>{orderDetails?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          {orderDetails && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Qté</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.produits.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{Number(p.sale_price).toFixed(2)} MAD</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>
                      {(p.sale_price * p.quantity).toFixed(2)} MAD
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* 🗑️ CONFIRMATION DELETE */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Supprimer la commande ?
            </DialogTitle>
            <DialogDescription>
              Confirmer la suppression de la commande.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✏️ MODAL ÉDITION */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier la commande</DialogTitle>
            <DialogDescription>
              Modifier les infos de <strong>{editOrder?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          {editOrder && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* 📌 NOM */}
                <div>
                  <label>Nom</label>
                  <input
                    type="text"
                    className="w-full border p-2"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* 📌 TÉLÉPHONE */}
                <div>
                  <label>Téléphone</label>
                  <input
                    type="text"
                    className="w-full border p-2"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                {/* 📌 EMAIL */}
                <div>
                  <label>Email</label>
                  <input
                    type="text"
                    className="w-full border p-2"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* 📌 ADRESSE */}
                <div>
                  <label>Adresse</label>
                  <input
                    type="text"
                    className="w-full border p-2"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                {/* 📌 STATUT */}
                <div>
                  <label>Statut</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <div className="flex justify-end">
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
