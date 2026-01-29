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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

/* ✅ API centralisée */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminLocations() {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /** ✅ FORM DATA POUR L’ÉDITION */
  const [formData, setFormData] = useState<any>({
    full_name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rental-requests`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLocations(data);
    } catch {
      toast.error("Erreur chargement locations");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  /** 🔁 Initialiser le formulaire quand on clique sur EDIT */
  useEffect(() => {
    if (selectedLocation) {
      setFormData({
        full_name: selectedLocation.full_name || "",
        phone: selectedLocation.phone || "",
        address: selectedLocation.address || "",
        notes: selectedLocation.notes || "",
      });
    }
  }, [selectedLocation]);

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
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {locations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell>
                    <div className="font-medium">{loc.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {loc.phone}
                      <br />
                      {loc.city}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge>{loc.produit?.title || "—"}</Badge>
                  </TableCell>

                  <TableCell>
                    {loc.rental_start} → {loc.rental_end}
                  </TableCell>

                  <TableCell>
                    <strong>{loc.total_price} MAD</strong>
                  </TableCell>

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails location</DialogTitle>
          </DialogHeader>

          {selectedLocation && (
            <div className="space-y-2 text-sm">
              <p><strong>Client :</strong> {selectedLocation.full_name}</p>
              <p><strong>Téléphone :</strong> {selectedLocation.phone}</p>
              <p><strong>Adresse :</strong> {selectedLocation.address}</p>
              <p><strong>Notes :</strong> {selectedLocation.notes || "-"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✏️ EDIT */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la demande</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                const res = await fetch(
                  `${API_BASE_URL}/api/rental-requests/${selectedLocation.id}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                  }
                );

                if (!res.ok) throw new Error();

                toast.success("Demande mise à jour");
                setIsEditOpen(false);
                fetchLocations();
              } catch {
                toast.error("Erreur mise à jour");
              }
            }}
            className="space-y-4"
          >
            <input
              className="border w-full px-3 py-2 rounded"
              placeholder="Nom complet"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />

            <input
              className="border w-full px-3 py-2 rounded"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <input
              className="border w-full px-3 py-2 rounded"
              placeholder="Adresse"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />

            <textarea
              className="border w-full px-3 py-2 rounded"
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />

            <Button type="submit" className="w-full">
              Enregistrer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🗑️ DELETE */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la demande ?</DialogTitle>
          </DialogHeader>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
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
