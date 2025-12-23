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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/register", {
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

      if (!response.ok) {
        toast({
          title: t("register.error"),
          description: data.message || t("register.serverError"),
          variant: "destructive",
        });
        return;
      }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <TopBar />
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-primary">
            {t("register.heroTitle")}
          </h3>
          <p className="mt-2 text-muted-foreground text-base">
            {t("register.heroSubtitle")}
          </p>
        </div>

        <Card className="max-w-5xl mx-auto overflow-hidden shadow-lg rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">{t("register.title")}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full">
                    <Label htmlFor="username">
                      {t("register.username")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder={t("register.usernamePlaceholder")}
                    />
                  </div>

                  <div className="w-full">
                    <Label htmlFor="phone">
                      {t("register.phone")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder={t("register.phonePlaceholder")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t("register.email")} <span className="text-destructive">*</span>
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

                <div className="space-y-2">
                  <Label htmlFor="password">
                    {t("register.password")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pr-10"
                      placeholder={t("register.passwordPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) =>
                      setFormData({ ...formData, remember: e.target.checked })
                    }
                    className="accent-primary"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    {t("register.remember")}
                  </Label>
                </div>

                <Button type="submit" className="w-full font-semibold py-6">
                  {t("register.submit")}
                </Button>

                <div className="text-sm text-muted-foreground bg-muted p-4 rounded">
                  {t("register.privacyText")}{" "}
                  <a
                    href="/politique-de-confidentialite"
                    className="text-primary hover:text-accent font-medium"
                  >
                    {t("register.privacyLink")}
                  </a>
                  .
                </div>

                <div className="text-center pt-4">
                  <span className="text-sm text-muted-foreground">
                    {t("register.alreadyHaveAccount")}{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-sm text-primary hover:text-accent font-medium"
                  >
                    {t("register.loginHere")}
                  </button>
                </div>
              </form>
            </CardContent>

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
