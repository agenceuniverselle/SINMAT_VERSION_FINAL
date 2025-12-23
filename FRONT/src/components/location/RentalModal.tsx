import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";

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
import { Check, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

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
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  if (!product) return null;

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `http://localhost:8000/storage/${product.image}`;

  const numberOfDays =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;

  const deliveryFee = 150;
  const subtotal = numberOfDays * product.price_per_day;
  const total = subtotal + deliveryFee;

  const handleSubmit = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: t("rentalModal.errors.missingDates"),
        description: t("rentalModal.errors.missingDatesDesc"),
        variant: "destructive",
      });
      return;
    }

    if (!deliveryDate || !deliveryTime) {
      toast({
        title: t("rentalModal.errors.deliveryMissing"),
        description: t("rentalModal.errors.deliveryMissingDesc"),
        variant: "destructive",
      });
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.city || !formData.address) {
      toast({
        title: t("rentalModal.errors.missingInfo"),
        description: t("rentalModal.errors.missingInfoDesc"),
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/rental-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          full_name: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          notes: formData.notes,
          rental_start: dateRange.from?.toISOString().split("T")[0],
          rental_end: dateRange.to?.toISOString().split("T")[0],
          delivery_date: deliveryDate?.toISOString().split("T")[0],
          delivery_time: deliveryTime,
          days_count: numberOfDays,
          price_per_day: product.price_per_day,
          delivery_fee: deliveryFee,
          total_price: total,
        }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: t("rentalModal.successTitle"),
        description: t("rentalModal.successDescription"),
      });

      setShowSuccess(true);
    } catch (error) {
      console.error("Erreur API:", error);
      toast({
        title: t("rentalModal.errors.generic"),
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppRedirect = () => {
    const message = `Bonjour, je souhaite louer:\n\n*${product.title}*\n\nDu ${format(dateRange!.from!, "dd/MM/yyyy")} au ${format(dateRange!.to!, "dd/MM/yyyy")}\nDurée: ${numberOfDays} jours\nTotal: ${total} MAD\n\nLivraison: ${format(deliveryDate!, "dd/MM/yyyy")} - ${deliveryTime}\n\nClient:\n${formData.fullName}\n${formData.phone}\n${formData.city}, ${formData.address}`;

    const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onOpenChange(false);
    setShowSuccess(false);
  };

  const resetAndClose = () => {
    setShowSuccess(false);
    onOpenChange(false);
    setDateRange(undefined);
    setDeliveryDate(undefined);
    setDeliveryTime("");
    setFormData({
      fullName: "",
      phone: "",
      city: "",
      address: "",
      notes: "",
    });
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
              <div className="lg:col-span-2 space-y-6">
                <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-lg">
                        {t("rentalModal.product.pricePerDay", {
                          price: product.price_per_day,
                        })}
                      </span>
                      <Badge variant={product.available ? "default" : "secondary"}>
                        {product.available
                          ? t("rentalModal.product.available")
                          : t("rentalModal.product.onOrder")}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    {t("rentalModal.period.label")} <span className="text-red-500">*</span>
                  </Label>
                  <div className="border rounded-lg p-4">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                      className="rounded-md pointer-events-auto"
                      locale={fr}
                    />
                  </div>
                  {dateRange?.from && dateRange?.to && (
                    <p className="text-sm text-muted-foreground">
                      {t("rentalModal.period.fromTo", {
                        from: format(dateRange.from, "dd MMMM yyyy", { locale: fr }),
                        to: format(dateRange.to, "dd MMMM yyyy", { locale: fr }),
                      })} •{" "}
                      <span className="font-semibold text-foreground">
                        {t(
                          numberOfDays > 1
                            ? "rentalModal.period.days"
                            : "rentalModal.period.day",
                          { count: numberOfDays }
                        )}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    {t("rentalModal.delivery.title")} <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("rentalModal.delivery.date")}</Label>
                      <div className="border rounded-lg p-3">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          disabled={(date) =>
                            date < new Date() ||
                            (dateRange?.from ? date < dateRange.from : false)
                          }
                          className="rounded-md pointer-events-auto"
                          locale={fr}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("rentalModal.delivery.time")}</Label>
                      <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("rentalModal.delivery.chooseTime")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">
                            {t("rentalModal.delivery.morning")}
                          </SelectItem>
                          <SelectItem value="afternoon">
                            {t("rentalModal.delivery.afternoon")}
                          </SelectItem>
                          <SelectItem value="evening">
                            {t("rentalModal.delivery.evening")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    {t("rentalModal.form.title")}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        {t("rentalModal.form.fullName")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder={t("rentalModal.form.fullName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t("rentalModal.form.phone")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        {t("rentalModal.form.city")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        placeholder="Ex: Tanger"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        {t("rentalModal.form.address")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder={t("rentalModal.form.address")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">{t("rentalModal.form.notes")}</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder={t("rentalModal.form.notesPlaceholder")}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-4">
                  <div className="border rounded-lg p-6 bg-card space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-3">
                      {t("rentalModal.summary.title")}
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("rentalModal.summary.product")}</span>
                        <span className="font-medium">{product.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("rentalModal.summary.pricePerDay")}</span>
                        <span className="font-medium">{product.price_per_day} MAD</span>
                      </div>

                      {dateRange?.from && dateRange?.to && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("rentalModal.summary.period")}</span>
                            <span className="font-medium">
                              {format(dateRange.from, "dd/MM")} - {format(dateRange.to, "dd/MM")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("rentalModal.summary.duration")}</span>
                            <span className="font-medium">
                              {numberOfDays} {numberOfDays > 1 ? t("rentalModal.period.days", { count: numberOfDays }) : t("rentalModal.period.day")}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-muted-foreground">{t("rentalModal.summary.subtotal")}</span>
                            <span className="font-medium">{subtotal} MAD</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("rentalModal.summary.deliveryFee")}</span>
                            <span className="font-medium">{deliveryFee} MAD</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t">
                            <span className="font-semibold text-base">{t("rentalModal.summary.total")}</span>
                            <span className="font-bold text-primary text-xl">
                              {total} MAD
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                    size="lg"
                    disabled={
                      !dateRange?.from ||
                      !dateRange?.to ||
                      !deliveryDate ||
                      !deliveryTime ||
                      !formData.fullName ||
                      !formData.phone ||
                      !formData.city ||
                      !formData.address
                    }
                  >
                    {t("rentalModal.buttons.submit")}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{t("rentalModal.successTitle")}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t("rentalModal.successDescription")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                onClick={handleWhatsAppRedirect}
                variant="default"
                size="lg"
                className="gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                {t("rentalModal.buttons.sendWhatsApp")}
              </Button>
              <Button onClick={resetAndClose} variant="outline" size="lg">
                {t("rentalModal.buttons.close")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
