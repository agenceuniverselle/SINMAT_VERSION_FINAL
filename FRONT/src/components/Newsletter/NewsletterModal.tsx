import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

/* ✅ API dynamique (local / prod) */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewsletterModal = ({ open, onOpenChange }: NewsletterModalProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ Validation Gmail (comme avant) */
  const isValidEmail = (email: string) =>
    /^[^\s@]+@gmail\.com$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError(t("newsletterModal.error"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur serveur");
      }

      toast.success(t("newsletterModal.success"));
      setEmail("");
      setError("");
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[90%] sm:w-[85%] md:max-w-3xl p-0 overflow-hidden bg-background/25 backdrop-blur-sm">

        {/* CLOSE */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 text-white opacity-70 hover:opacity-100"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative min-h-[400px] flex items-center justify-center bg-gradient-to-br from-navy/90 to-navy/70 p-12">
          <div className="absolute inset-0 bg-[url('/images/drog.png')] bg-cover bg-center opacity-30" />

          <div className="relative z-10 text-center max-w-xl">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-4xl md:text-5xl font-bold text-white whitespace-pre-line">
                {t("newsletterModal.title")}
              </DialogTitle>
              <DialogDescription className="text-lg text-white/90">
                {t("newsletterModal.description")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder={t("newsletterModal.placeholder")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  className="flex-1 h-12 bg-white/90 border-none text-foreground placeholder:text-muted-foreground"
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  {loading
                    ? t("newsletterModal.sending", "Envoi...")
                    : t("newsletterModal.submit")}
                </Button>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <p className="text-sm text-white/80">
                {t("newsletterModal.privacyText")}{" "}
                <a
                  href="/politique-de-confidentialite"
                  className="underline hover:text-white"
                >
                  {t("newsletterModal.privacyLink")}
                </a>
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterModal;
