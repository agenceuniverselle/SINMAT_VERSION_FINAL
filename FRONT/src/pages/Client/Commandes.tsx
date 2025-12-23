import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import AppHeader from "@/layout/AppHeader";
import ClientSidebar from "@/layout/ClientSidebar";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  created_at: string;
  status: string;
  total: number;
  address: string;
  phone: string;
  items: OrderItem[];
};

export default function Commandes() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = sessionStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/api/mes-commandes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erreur API");

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Erreur chargement commandes :", error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "livrée":
      case "Livrée":
        return "bg-green-500";
      case "expédiée":
      case "Expédiée":
        return "bg-blue-500";
      case "en cours":
      case "En cours":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      {/* ✅ MODAL (DOIT ÊTRE EN DEHORS DU LAYOUT) */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>
              Commande CMD-{selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Passée le {selectedOrder?.created_at}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Produits */}
              <div>
                <h3 className="font-semibold mb-2">Articles commandés</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead className="text-right">
                        Prix unitaire
                      </TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">
{Number(item.price).toFixed(2)} MAD
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.quantity * item.price).toFixed(2)} MAD
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{selectedOrder.total.toFixed(2)} MAD</span>
              </div>

              {/* Adresse */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-1">Adresse de livraison</h3>
                <p className="text-muted-foreground">
                  {selectedOrder.address}
                </p>
                <p className="text-muted-foreground">
                  📞 {selectedOrder.phone}
                </p>
              </div>

              {/* Statut */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-1">Statut</h3>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ PAGE */}
      <div className="flex min-h-screen bg-background">
        <ClientSidebar />

        <div className="flex-1 ml-[250px]">
          <AppHeader />

          <main className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes commandes</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground">
                    Aucune commande trouvée.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            CMD-{order.id}
                          </TableCell>
                          <TableCell>{order.created_at}</TableCell>
                          <TableCell>
                            {order.total.toFixed(2)} MAD
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(order.status)}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              Voir détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}
