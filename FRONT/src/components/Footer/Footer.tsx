import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const isValidGmail = (email: string) => /^[^\s@]+@gmail\.com$/.test(email);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidGmail(email)) {
      toast.error(t("footer.newsletter.invalidEmail"));
      return;
    }

    setSending(true);
    try {
      const res = await fetch("http://localhost:8000/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t("footer.newsletter.error"));
      }

      toast.success(t("footer.newsletter.success"));
      setEmail("");
    } catch (error) {
      toast.error(t("footer.newsletter.error"));
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="bg-gray-600 text-gray-300 mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/logov.webp"
                alt="Sinmat Logo"
                className="h-12 object-contain"
              />
              <h2 className="text-white text-xl font-semibold">SINMAT</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("footer.description")}
            </p>

            {/* Socials */}
            <div className="flex gap-3 mt-3">
              <a
                href="https://www.facebook.com/share/1BynC318yp/"
                className="p-2 bg-gray-800 hover:bg-orange-500 rounded-full transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/sinmat.sarl?igsh=YW5kZTIwcXNlZDJl"
                className="p-2 bg-gray-800 hover:bg-orange-500 rounded-full transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t("footer.contact.title")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 text-orange-500" />
                <span>{t("footer.contact.address")}</span>
              </li>
              <li className="flex items-center gap-2">
  <Phone className="w-4 h-4 text-orange-500" />
  <a
    href="tel:+212666565325"
    className="hover:text-orange-400 transition"
    dir="ltr"
    style={{ unicodeBidi: "bidi-override" }}
  >
    +212 6 66 56 53 25
  </a>
</li>

              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <a href="mailto:contact@sinmat.ma" className="hover:text-orange-400 transition">
                  contact@sinmat.ma
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{t("footer.contact.hours")}</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t("footer.links.title")}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="hover:text-orange-400 transition">{t("footer.links.home")}</a></li>
              <li><a href="/Catalogue" className="hover:text-orange-400 transition">{t("footer.links.products")}</a></li>
              <li><a href="/Propos" className="hover:text-orange-400 transition">{t("footer.links.about")}</a></li>
              <li><a href="/contact" className="hover:text-orange-400 transition">{t("footer.links.contact")}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-4">{t("footer.newsletter.title")}</h3>
            <p className="text-sm text-gray-400 mb-4">{t("footer.newsletter.description")}</p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <input
                type="email"
                required
                placeholder={t("footer.newsletter.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 w-full px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
              <button
                type="submit"
                disabled={sending}
                className="px-5 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition"
              >
                {sending ? t("footer.newsletter.sending") : t("footer.newsletter.subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p className="mb-2 md:mb-0">
              © {new Date().getFullYear()} Sinmat. {t("footer.rights")}
            </p>

            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <a href="/mentions-legales" className="hover:text-orange-400 transition">{t("footer.legal")}</a>
              <a href="/conditions-generales-de-vente" className="hover:text-orange-400 transition">{t("footer.cgv")}</a>
              <a href="/politique-de-confidentialite" className="hover:text-orange-400 transition">{t("footer.privacy")}</a>
              <a href="/politique-des-cookies" className="hover:text-orange-400 transition">{t("footer.cookies")}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
