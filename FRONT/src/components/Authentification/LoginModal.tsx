import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

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

export const LoginModal = ({
  open,
  onOpenChange,
  onCreateAccount,
}: LoginModalProps) => {
  const { t, i18n } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("auth_token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          if (data.redirect) {
            window.location.href = data.redirect;
          } else if (
            data.user?.email?.includes("@sinmat.ma") ||
            (data.user?.email?.includes("admin") &&
              data.user?.email?.includes("@gmail"))
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
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "google") {
      window.location.href = "http://localhost:8000/auth/google";
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
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">
              {t("loginModal.usernameLabel")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              type="text"
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

          {/* Submit */}
          <Button type="submit" className="w-full font-semibold">
            {t("loginModal.loginButton")}
          </Button>

          {/* Lost password */}
          <div className="text-center">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {t("loginModal.lostPassword")}
            </a>
          </div>
        </form>

        {/* Separator */}
        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-muted-foreground">
            {t("loginModal.orLoginWith")}
          </span>
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => handleSocialLogin("google")}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t("loginModal.loginWithGoogle")}
        </Button>

        {/* Create account */}
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
