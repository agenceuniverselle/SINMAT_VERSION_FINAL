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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function AdminCommandes() {
  const [orders, setOrders] = useState<any[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [editOrder, setEditOrder] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const STATUSES = ["en attente", "en cours", "expédiée", "livrée", "annulée"];

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/commandes");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
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
        `http://localhost:8000/api/commandes/${selectedOrder.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();
      toast.success("Commande supprimée");
      setOrders((prev) =>
        prev.filter((order) => order.id !== selectedOrder.id)
      );
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setConfirmDelete(false);
      setSelectedOrder(null);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/commandes/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Statut mis à jour");
      fetchOrders(); // 🔄 refresh
    } catch (err) {
      toast.error("Erreur de mise à jour du statut");
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
  <span className="capitalize px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm">
    {order.status}
  </span>
</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* 👁️ View details */}
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


                      {/* ✏️ Edit (statut modifiable directement) */}
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


                      {/* 🗑️ Delete */}
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
<Dialog open={showDetails} onOpenChange={setShowDetails}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Détails de la commande</DialogTitle>
      <DialogDescription>
        Commande passée par <strong>{orderDetails?.name}</strong> le{" "}
        {orderDetails?.created_at &&
          new Date(orderDetails.created_at).toLocaleDateString("fr-FR")}
      </DialogDescription>
    </DialogHeader>

    {orderDetails && Array.isArray(orderDetails.produits) && (
      <div className="space-y-4 mt-4">
        {/* 🧍 Infos client */}
        <div className="space-y-1 text-sm">
          <p><strong>Email :</strong> {orderDetails.email}</p>
          <p><strong>Téléphone :</strong> {orderDetails.phone}</p>
          <p><strong>Adresse :</strong> {orderDetails.address}</p>
          <p><strong>Statut :</strong> {orderDetails.status}</p>
        </div>

        {/* 📦 Table des produits */}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
           {orderDetails.produits.map((p: any) => {
  console.log("PRODUIT:", p); // ✔ log ici, pas dans le JSX

  return (
    <TableRow key={p.id}>
     <TableCell>
  <div className="flex flex-col items-start gap-1">
    
  {p.name}
  </div>
</TableCell>

      <TableCell>{Number(p.sale_price).toFixed(2)} MAD</TableCell>
      <TableCell>{p.quantity}</TableCell>
      <TableCell>
        {(Number(p.sale_price) * p.quantity).toFixed(2)} MAD
      </TableCell>
    </TableRow>
  );
})}

            </TableBody>
          </Table>

          {/* 💰 Total global */}
          <div className="text-right font-semibold mt-4">
            Total :{" "}
            {orderDetails.produits
              .reduce(
                (acc: number, p: any) =>
                  acc + p.sale_price * p.quantity,
                0
              )
              .toFixed(2)}{" "}
            MAD
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Modifier la commande</DialogTitle>
      <DialogDescription>
        Modifier les informations client, produits et statut.
      </DialogDescription>
    </DialogHeader>

    {editOrder && (
      <div className="space-y-4">
        {/* Client info */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            value={editOrder.name}
            onChange={(e) =>
              setEditOrder({ ...editOrder, name: e.target.value })
            }
            placeholder="Nom du client"
          />
          <input
            className="input"
            value={editOrder.email}
            onChange={(e) =>
              setEditOrder({ ...editOrder, email: e.target.value })
            }
            placeholder="Email"
          />
          <input
            className="input"
            value={editOrder.phone}
            onChange={(e) =>
              setEditOrder({ ...editOrder, phone: e.target.value })
            }
            placeholder="Téléphone"
          />
          <input
            className="input"
            value={editOrder.address}
            onChange={(e) =>
              setEditOrder({ ...editOrder, address: e.target.value })
            }
            placeholder="Adresse"
          />
        </div>

        {/* Statut */}
        <Select
          value={editOrder.status}
          onValueChange={(value) =>
            setEditOrder({ ...editOrder, status: value })
          }
        >
          <SelectTrigger>
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

        {/* Produits */}
        {editOrder.produits.map((p: any, index: number) => (
          <div key={p.id} className="flex items-center gap-4">
            <div className="w-48">{p.name}</div>
            <div>{Number(p.sale_price).toFixed(2)} MAD</div>
            <input
              type="number"
              className="input w-24"
              value={p.quantity}
              min={1}
              onChange={(e) => {
                const updatedProducts = [...editOrder.produits];
                updatedProducts[index].quantity = Number(e.target.value);
                setEditOrder({ ...editOrder, produits: updatedProducts });
              }}
            />
          </div>
        ))}

        {/* Save button */}
        <div className="text-right mt-4">
          <Button onClick={async () => {
            try {
              const res = await fetch(`http://localhost:8000/api/commandes/${editOrder.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editOrder),
              });

              if (!res.ok) throw new Error();
              toast.success("Commande mise à jour");
              setIsEditOpen(false);
              fetchOrders();
            } catch (err) {
              toast.error("Erreur lors de la mise à jour");
            }
          }}>
            Enregistrer
          </Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

      {/* 🗑️ Modale de confirmation de suppression */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Supprimer la commande ?
            </DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer la commande de{" "}
              <strong>{selectedOrder?.client_name}</strong> ?
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
    </div>
  );
}
