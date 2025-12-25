import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ✅ API dynamique (prod / local) */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Subscriber {
  id: number;
  email?: string;
  phone?: string;
}

interface EditNewsletterModalProps {
  open: boolean;
  onClose: () => void;
  subscriber: Subscriber | null;
  onUpdated: () => void;
}

export const EditNewsletterModal = ({
  open,
  onClose,
  subscriber,
  onUpdated,
}: EditNewsletterModalProps) => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subscriber) {
      setFormData({
        email: subscriber.email ?? "",
        phone: subscriber.phone ?? "",
      });
    }
  }, [subscriber]);

  const handleUpdate = async () => {
    if (!subscriber) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/newsletter-subscribers/${subscriber.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Erreur API :", err);
        throw new Error();
      }

      toast.success("Abonné mis à jour avec succès");
      onUpdated();
      onClose();
    } catch {
      toast.error("Erreur lors de la mise à jour de l’abonné");
    } finally {
      setLoading(false);
    }
  };

  if (!subscriber) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l’abonné</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* EMAIL */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="ex: client@email.com"
            />
          </div>

          {/* PHONE */}
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+212 6XX XXX XXX"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
