import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditNewsletterModalProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber: any;
  onUpdated: () => void;
}

export const EditNewsletterModal = ({ open, onClose, subscriber, onUpdated }: EditNewsletterModalProps) => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (subscriber) {
      setFormData({
        email: subscriber.email || "",
        phone: subscriber.phone || "",
      });
    }
  }, [subscriber]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/newsletter-subscribers/${subscriber.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("Abonné mis à jour");
      onUpdated();
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l’abonné</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleUpdate}>Enregistrer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
