import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const NewsletterSection = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@gmail\.com$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error(t("newsletter.error"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l’inscription");
      }

      toast.success(t("newsletter.success"));
      setEmail("");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* LEFT : Icon + Text */}
          <div className="flex items-center gap-4">
            <img
              src="images/casque.png"
              alt="Casque"
              className="w-40 h-40 object-contain"
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {t("newsletter.title")}
              </h3>
              <p className="text-xl font-semibold text-gray-800 mt-1">
                {t("newsletter.subtitle")}
              </p>
            </div>
          </div>

          {/* RIGHT : Newsletter Form */}
          <div className="w-full md:w-[480px]">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row md:items-center gap-3"
            >
              <Input
                type="email"
                placeholder={t("newsletter.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border border-gray-300 text-gray-800 h-11"
              />

              <Button
                type="submit"
                className="bg-[#ff6a00] hover:bg-[#e65900] text-white font-bold px-6 h-11"
                disabled={loading}
              >
                {loading ? t("newsletter.sending") : t("newsletter.button")}
              </Button>
            </form>

            <p className="text-xs text-gray-600 mt-2">
              {t("newsletter.privacy")}{" "}
              <a
                href="/politique-de-confidentialite"
                className="underline hover:text-[#ff6a00]"
              >
                {t("newsletter.privacyLink")}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
