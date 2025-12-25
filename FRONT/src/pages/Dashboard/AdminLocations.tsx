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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ✅ API centralisée */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminLocations() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [locations, setLocations] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const formatDeliveryTime = (time: string) => {
    switch (time) {
      case "morning":
        return "Matin (08h - 12h)";
      case "afternoon":
        return "Après-midi (14h - 18h)";
      case "evening":
        return "Soir (18h - 20h)";
      default:
        return time;
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rental-requests`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error("Erreur chargement locations :", err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  /* 🔢 Calculs */
  const calcDays = (start: string, end: string): number => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1, 1);
  };

  const calcTotal = (
    days: number,
    pricePerDay: number,
    deliveryFee: number
  ): number => {
    return days * pricePerDay + deliveryFee;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Demandes de location</h1>

      <Card>
        <CardHeader>
          <CardTitle>Liste des demandes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Matériel</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Livraison</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((loc) => (
                <TableRow key={loc.id}>
                  {/* Client */}
                  <TableCell>
                    <div className="font-medium">{loc.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {loc.phone}
                      <br />
                      {loc.city}
                    </div>
                  </TableCell>

                  {/* Matériel */}
                  <TableCell>
                    <Badge>{loc.produit?.title || "—"}</Badge>
                  </TableCell>

                  {/* Période */}
                  <TableCell>
                    <div>
                      Du <strong>{loc.rental_start}</strong> au{" "}
                      <strong>{loc.rental_end}</strong>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {loc.days_count} jour(s)
                    </div>
                  </TableCell>

                  {/* Livraison */}
                  <TableCell>
                    {loc.delivery_date} —{" "}
                    {formatDeliveryTime(loc.delivery_time)}
                    <div className="text-sm text-muted-foreground">
                      {loc.address}
                    </div>
                  </TableCell>

                  {/* Total */}
                  <TableCell>
                    <div className="font-semibold text-primary">
                      {loc.total_price} MAD
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ({loc.price_per_day} MAD/jour +{" "}
                      {loc.delivery_fee} MAD)
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsViewOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 text-yellow-500" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsDeleteOpen(true);
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

      {/* 👁️ VIEW */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la location</DialogTitle>
          </DialogHeader>

          {selectedLocation && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Client :</strong> {selectedLocation.full_name} —{" "}
                {selectedLocation.phone}
              </p>
              <p>
                <strong>Matériel :</strong>{" "}
                {selectedLocation.produit?.title}
              </p>
              <p>
                <strong>Période :</strong>{" "}
                {selectedLocation.rental_start} →{" "}
                {selectedLocation.rental_end}
              </p>
              <p>
                <strong>Livraison :</strong>{" "}
                {selectedLocation.delivery_date} à{" "}
                {formatDeliveryTime(selectedLocation.delivery_time)}
              </p>
              <p>
                <strong>Adresse :</strong> {selectedLocation.address}
              </p>
              <p>
                <strong>Notes :</strong>{" "}
                {selectedLocation.notes || "-"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✏️ EDIT */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la demande</DialogTitle>
          </DialogHeader>

          {selectedLocation && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const res = await fetch(
                  `${API_BASE_URL}/api/rental-requests/${selectedLocation.id}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedLocation),
                  }
                );

                if (res.ok) {
                  setIsEditOpen(false);
                  fetchLocations();
                }
              }}
              className="space-y-4"
            >
              <input
                className="border w-full px-3 py-2 rounded"
                value={selectedLocation.full_name}
                onChange={(e) =>
                  setSelectedLocation({
                    ...selectedLocation,
                    full_name: e.target.value,
                  })
                }
              />

              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 🗑️ DELETE */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer la demande ?</DialogTitle>
          </DialogHeader>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await fetch(
                  `${API_BASE_URL}/api/rental-requests/${selectedLocation.id}`,
                  { method: "DELETE" }
                );
                setIsDeleteOpen(false);
                fetchLocations();
              }}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
