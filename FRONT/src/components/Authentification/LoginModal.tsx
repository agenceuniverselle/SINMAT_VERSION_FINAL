import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import GoogleIcon from "@/assets/google.svg";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAccount: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const LoginModal = ({
  open,
  onOpenChange,
  onCreateAccount,
}: LoginModalProps) => {
  const { t, i18n } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(""); // email OU téléphone
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOGIN FUNCTION =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert(t("loginModal.errors.invalid"));
      return;
    }

    setLoading(true);

    // 🔥 Détecter si c'est un email ou un téléphone
    const isEmail = username.includes("@");

    const payload = isEmail
      ? { email: username, password }
      : { phone: username, password };

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔐 Sauvegarde session
        sessionStorage.setItem("auth_token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // 🔥 Redirection intelligente selon rôle / email
        setTimeout(() => {
          if (data.redirect) {
            window.location.href = data.redirect;
          } else if (
            data.user?.email?.includes("@sinmat.ma") ||
            data.user?.role === "admin"
          ) {
            window.location.href = "/dashboard-admin";
          } else {
            window.location.href = "/dashboard-client";
          }
        }, 300);
      } else {
        alert(data.message || t("loginModal.errors.invalid"));
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(t("loginModal.errors.generic"));
    }

    setLoading(false);
  };

  // ================= GOOGLE LOGIN =================
  const handleSocialLogin = (provider: string) => {
    if (provider === "google") {
      const baseUrl = API_BASE_URL.replace("/api", "");
      window.location.href = `${baseUrl}/auth/google`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[440px]"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t("loginModal.title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          {/* Username (Email ou Téléphone) */}
          <div className="space-y-2">
            <Label htmlFor="username">
              {t("loginModal.usernameLabel")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Email ou téléphone"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {t("loginModal.passwordLabel")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={loading}
          >
            {loading
              ? t("loginModal.loading", "Connexion...", "جارٍ الدخول...")
              : t("loginModal.loginButton")}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-muted-foreground">
            {t("loginModal.orLoginWith")}
          </span>
        </div>

        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3"
          onClick={() => handleSocialLogin("google")}
        >
          <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          <span className="font-medium">
            {t("loginModal.loginWithGoogle")}
          </span>
        </Button>

        <div className="text-center mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={onCreateAccount}
            className="text-sm text-muted-foreground hover:text-primary font-medium"
          >
            {t("loginModal.createAccount")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
