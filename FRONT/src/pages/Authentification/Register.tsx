import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

/* ✅ API dynamique */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const drogerieImage = "/images/hero-droguerie.jpg";

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    remember: false,
  });

  /* 🔁 Input handler */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  /* 📝 Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Réponse serveur invalide");
      }

      /* ❌ Validation Laravel */
      if (response.status === 422 && data.errors) {
        Object.values(data.errors)
          .flat()
          .forEach((message: string) => {
            toast({
              title: t("register.error"),
              description: message,
              variant: "destructive",
            });
          });
        return;
      }

      /* ❌ Autre erreur */
      if (!response.ok) {
        toast({
          title: t("register.error"),
          description: data.message || t("register.serverError"),
          variant: "destructive",
        });
        return;
      }

      /* ✅ Succès */
      sessionStorage.setItem("auth_token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      const isAdmin = data.user.email === "contact@sinmat.ma";
      window.location.href = isAdmin
        ? "/dashboard-admin"
        : "/dashboard-client";
    } catch (error) {
      console.error("Erreur JS:", error);
      toast({
        title: t("register.error"),
        description: t("register.connectionError"),
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-background"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <TopBar />
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-primary">
            {t("register.heroTitle")}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {t("register.heroSubtitle")}
          </p>
        </div>

        <Card className="max-w-5xl mx-auto overflow-hidden shadow-lg rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">
                {t("register.title")}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* USERNAME + PHONE */}
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full">
                    <Label htmlFor="username">
                      {t("register.username")}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder={t("register.usernamePlaceholder")}
                    />
                  </div>

                  <div className="w-full">
                    <Label htmlFor="phone">
                      {t("register.phone")}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder={t("register.phonePlaceholder")}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <Label htmlFor="email">
                    {t("register.email")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t("register.emailPlaceholder")}
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <Label htmlFor="password">
                    {t("register.password")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pr-10"
                      placeholder={t("register.passwordPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* REMEMBER */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="accent-primary"
                  />
                  <Label htmlFor="remember">
                    {t("register.remember")}
                  </Label>
                </div>

                <Button type="submit" className="w-full py-6 font-semibold">
                  {t("register.submit")}
                </Button>

                {/* PRIVACY */}
                <div className="text-sm bg-muted p-4 rounded">
                  {t("register.privacyText")}{" "}
                  <a
                    href="/politique-de-confidentialite"
                    className="text-primary font-medium"
                  >
                    {t("register.privacyLink")}
                  </a>
                  .
                </div>

                {/* LOGIN */}
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    {t("register.alreadyHaveAccount")}{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-primary font-medium"
                  >
                    {t("register.loginHere")}
                  </button>
                </div>
              </form>
            </CardContent>

            {/* IMAGE */}
            <div className="hidden lg:block">
              <img
                src={drogerieImage}
                alt="Produits de droguerie"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
