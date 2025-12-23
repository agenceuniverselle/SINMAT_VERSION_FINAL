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
      return time; // fallback
  }
};

  const fetchLocations = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/rental-requests");
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);
// ➕ Ajoute ces fonctions dans le composant AdminLocations
const calcDays = (start: string, end: string): number => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1, 1);
};

const calcTotal = (days: number, pricePerDay: number, deliveryFee: number): number => {
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
                      {loc.phone} <br />
                      {loc.city}
                    </div>
                  </TableCell>

                  {/* Matériel */}
                  <TableCell>
                   <Badge className="text-sm">
  {loc.produit?.title || "?"} 
</Badge>

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
                    {loc.delivery_date} — {loc.delivery_time}
                    <div className="text-sm text-muted-foreground">
                      {loc.address}
                    </div>
                  </TableCell>

                  {/* Prix */}
                  <TableCell>
                    <div className="font-semibold text-primary">
                      {loc.total_price} MAD
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ({loc.price_per_day} MAD/jour + {loc.delivery_fee} MAD livraison)
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
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Détails de la location</DialogTitle>
    </DialogHeader>

    {selectedLocation && (
      <div className="space-y-4 text-sm">
        <p>
          <strong>Client :</strong> {selectedLocation.full_name} — {selectedLocation.phone}
        </p>
        <p>
          <strong>Matériel :</strong> {selectedLocation.produit?.title || "?"}
        </p>
        <p>
          <strong>Période :</strong> {selectedLocation.rental_start} → {selectedLocation.rental_end} ({selectedLocation.days_count} jours)
        </p>
        <p>
<p>
  <strong>Livraison :</strong> {selectedLocation.delivery_date} à {formatDeliveryTime(selectedLocation.delivery_time)}
</p>
        </p>
        <p>
          <strong>Adresse :</strong> {selectedLocation.address}
        </p>
        <p>
          <strong>Notes :</strong> {selectedLocation.notes || "-"}
        </p>
        <p>
          <strong>Total :</strong> {selectedLocation.total_price} MAD
          <br />
          <span className="text-muted-foreground">
            ({selectedLocation.price_per_day} MAD/jour + {selectedLocation.delivery_fee} MAD livraison)
          </span>
        </p>
      </div>
    )}
  </DialogContent>
</Dialog>
<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Modifier la demande</DialogTitle>
    </DialogHeader>

    {selectedLocation && (
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const res = await fetch(`http://localhost:8000/api/rental-requests/${selectedLocation.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedLocation),
          });

          if (res.ok) {
            setIsEditOpen(false);
            fetchLocations();
          }
        }}
        className="space-y-4"
      >
        {/* Infos client */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nom complet</label>
            <input
              className="border w-full px-3 py-2 mt-1 rounded"
              value={selectedLocation.full_name}
              onChange={(e) =>
                setSelectedLocation({ ...selectedLocation, full_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Téléphone</label>
            <input
              className="border w-full px-3 py-2 mt-1 rounded"
              value={selectedLocation.phone}
              onChange={(e) =>
                setSelectedLocation({ ...selectedLocation, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Ville</label>
            <input
              className="border w-full px-3 py-2 mt-1 rounded"
              value={selectedLocation.city}
              onChange={(e) =>
                setSelectedLocation({ ...selectedLocation, city: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Adresse</label>
            <input
              className="border w-full px-3 py-2 mt-1 rounded"
              value={selectedLocation.address}
              onChange={(e) =>
                setSelectedLocation({ ...selectedLocation, address: e.target.value })
              }
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea
            className="border w-full px-3 py-2 mt-1 rounded"
            rows={3}
            value={selectedLocation.notes || ""}
            onChange={(e) =>
              setSelectedLocation({ ...selectedLocation, notes: e.target.value })
            }
          />
        </div>

        {/* Livraison */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Date de livraison</label>
            <input
              type="date"
              className="border w-full px-3 py-2 mt-1 rounded"
              value={selectedLocation.delivery_date}
              onChange={(e) =>
                setSelectedLocation({ ...selectedLocation, delivery_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Créneau</label>
            <select
              className="border w-full px-3 py-2 mt-1 rounded"
              value={selectedLocation.delivery_time}
              onChange={(e) =>
                setSelectedLocation({ ...selectedLocation, delivery_time: e.target.value })
              }
            >
              <option value="morning">Matin (08h - 12h)</option>
              <option value="afternoon">Après-midi (14h - 18h)</option>
              <option value="evening">Soir (18h - 20h)</option>
            </select>
          </div>
        </div>

        {/* Dates location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Date de début</label>
            <input
              type="date"
              className="border w-full px-3 py-2 mt-1 rounded"
              value={selectedLocation.rental_start}
              onChange={(e) => {
                const newStart = e.target.value;
                const end = selectedLocation.rental_end;
                const diffDays = calcDays(newStart, end);
                setSelectedLocation({
                  ...selectedLocation,
                  rental_start: newStart,
                  days_count: diffDays,
                  total_price: calcTotal(diffDays, selectedLocation.price_per_day, selectedLocation.delivery_fee),
                });
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date de fin</label>
            <input
              type="date"
              className="border w-full px-3 py-2 mt-1 rounded"
              value={selectedLocation.rental_end}
              onChange={(e) => {
                const newEnd = e.target.value;
                const start = selectedLocation.rental_start;
                const diffDays = calcDays(start, newEnd);
                setSelectedLocation({
                  ...selectedLocation,
                  rental_end: newEnd,
                  days_count: diffDays,
                  total_price: calcTotal(diffDays, selectedLocation.price_per_day, selectedLocation.delivery_fee),
                });
              }}
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-4">
          Enregistrer les modifications
        </Button>
      </form>
    )}
  </DialogContent>
</Dialog>

<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
  <DialogContent className="max-w-sm">
    <DialogHeader>
      <DialogTitle>Supprimer la demande ?</DialogTitle>
    </DialogHeader>

    <p className="text-sm text-muted-foreground mb-4">
      Cette action est irréversible. Voulez-vous vraiment supprimer cette demande ?
    </p>

    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
        Annuler
      </Button>
      <Button
        variant="destructive"
        onClick={async () => {
          const res = await fetch(
            `http://localhost:8000/api/rental-requests/${selectedLocation.id}`,
            {
              method: "DELETE",
            }
          );

          if (res.ok) {
            setIsDeleteOpen(false);
            fetchLocations(); // refresh
          }
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
