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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

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
      <DialogContent
        className="
          w-full
          sm:max-w-xl
          md:max-w-2xl
          lg:max-w-3xl
          h-[100dvh]
          sm:h-auto
          p-0
          overflow-hidden
          bg-background/30
          backdrop-blur-md
        "
      >
        {/* CLOSE */}
        <button
          onClick={() => onOpenChange(false)}
          className="
            absolute right-4 top-4 z-50
            text-white/80 hover:text-white
          "
        >
          <X className="h-6 w-6" />
        </button>

        {/* CONTENT */}
        <div
          className="
            relative
            min-h-[100dvh]
            sm:min-h-[420px]
            flex items-center justify-center
            px-6 py-10
            sm:p-12
            bg-gradient-to-br from-navy/90 to-navy/70
          "
        >
          {/* BG IMAGE */}
          <div className="absolute inset-0 bg-[url('/images/drog.png')] bg-cover bg-center opacity-30" />

          <div className="relative z-10 w-full max-w-xl text-center">
            <DialogHeader className="space-y-3">
              <DialogTitle
                className="
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  font-bold
                  text-white
                  whitespace-pre-line
                "
              >
                {t("newsletterModal.title")}
              </DialogTitle>

              <DialogDescription className="text-sm sm:text-base text-white/90">
                {t("newsletterModal.description")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                  className="
                    h-11
                    sm:h-12
                    bg-white/95
                    border-none
                    text-foreground
                    placeholder:text-muted-foreground
                  "
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="
                    h-11
                    sm:h-12
                    px-6
                    bg-primary
                    hover:bg-primary/90
                    text-white
                    font-semibold
                  "
                >
                  {loading
                    ? t("newsletterModal.sending", "Envoi...")
                    : t("newsletterModal.submit")}
                </Button>
              </div>

              {error && (
                <p className="text-sm text-red-400 text-left">
                  {error}
                </p>
              )}

              <p className="text-xs sm:text-sm text-white/80">
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
