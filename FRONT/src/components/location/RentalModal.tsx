import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { DateRange } from "react-day-picker";
import { Check, MessageCircle } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

/* ✅ URLs dynamiques */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

interface RentalProduct {
  id: number;
  title: string;
  price_per_day: number;
  image: string;
  available: boolean;
  description: string;
}

interface RentalModalProps {
  product: RentalProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RentalModal({ product, open, onOpenChange }: RentalModalProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryTime, setDeliveryTime] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  if (!product) return null;

 const imageUrl =
  product.image && product.image !== ""
    ? product.image.startsWith("http")
      ? product.image
      : `https://sinmat.ma/storage/${product.image}`
    : "/placeholder.png";


  const days =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;

  const deliveryFee = 150;
  const subtotal = days * product.price_per_day;
  const total = subtotal + deliveryFee;

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rental-requests`, {
        method: "POST",
      headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",   
  },
        body: JSON.stringify({
          product_id: product.id,
          full_name: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          notes: formData.notes,
          rental_start: dateRange?.from?.toISOString().split("T")[0],
          rental_end: dateRange?.to?.toISOString().split("T")[0],
          delivery_date: deliveryDate?.toISOString().split("T")[0],
          delivery_time: deliveryTime,
          days_count: days,
          price_per_day: product.price_per_day,
          delivery_fee: deliveryFee,
          total_price: total,
        }),
      });

      if (!res.ok) throw new Error();
      setShowSuccess(true);
    } catch {
      toast({
        title: t("rentalModal.errors.generic"),
        variant: "destructive",
      });
    }
  };

  const sendWhatsApp = () => {
    const msg = `Bonjour, je souhaite louer:\n\n${product.title}\nDu ${format(
      dateRange!.from!,
      "dd/MM/yyyy"
    )} au ${format(dateRange!.to!, "dd/MM/yyyy")}\nDurée: ${days} jours\nTotal: ${total} MAD\n\nClient:\n${formData.fullName}\n${formData.phone}\n${formData.city}, ${formData.address}`;

    window.open(
      `https://wa.me/212600000000?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    onOpenChange(false);
    setShowSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {t("rentalModal.title")}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                  <img
                    src={imageUrl}
                    className="w-24 h-24 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <Badge className="mt-2">
                      {product.price_per_day} MAD / jour
                    </Badge>
                  </div>
                </div>

                <Label>Période *</Label>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  locale={fr}
                  disabled={(date) => date < new Date()}
                />

                <Label>Livraison *</Label>
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  locale={fr}
                />

                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir l'heure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matin">Matin</SelectItem>
                    <SelectItem value="apres-midi">Après-midi</SelectItem>
                    <SelectItem value="soir">Soir</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Informations client</Label>
                <Input
                  placeholder="Nom complet"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
                <Input
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <Input
                  placeholder="Ville"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
                <Input
                  placeholder="Adresse"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              {/* RIGHT */}
              <div>
                <div className="border rounded-lg p-4 space-y-3">
                  <p>Jours : {days}</p>
                  <p>Sous-total : {subtotal} MAD</p>
                  <p>Livraison : {deliveryFee} MAD</p>
                  <p className="font-bold text-lg">Total : {total} MAD</p>

                  <Button onClick={handleSubmit} className="w-full">
                    Envoyer la demande
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10 space-y-6">
            <Check className="mx-auto w-12 h-12 text-green-600" />
            <h2 className="text-2xl font-bold">
              {t("rentalModal.successTitle")}
            </h2>

            <Button onClick={sendWhatsApp} className="gap-2">
              <MessageCircle /> Envoyer sur WhatsApp
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
