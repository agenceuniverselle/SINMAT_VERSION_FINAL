import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface EditMessageModalProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
  onUpdated: () => void;
}

export const EditMessageModal = ({ open, onClose, message, onUpdated }: EditMessageModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (message) {
      setFormData({
        name: message.name || "",
        email: message.email || "",
        subject: message.subject || "",
        message: message.message || "",
      });
    }
  }, [message]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/contact-messages/${message.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("Message modifié avec succès");
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
          <DialogTitle>Modifier le message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <Label>Sujet</Label>
            <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
          </div>
          <div>
  <Label>Message</Label>
  <Textarea
    value={formData.message}
    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
    className="min-h-[120px]" // 👈 ajuste la hauteur ici
  />
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
