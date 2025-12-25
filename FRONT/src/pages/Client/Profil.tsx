// 📁 src/pages/Client/Profil.tsx

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import AppHeader from "@/layout/AppHeader";
import ClientSidebar from "@/layout/ClientSidebar";

/* ✅ API centralisée */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profil() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  /* 🔄 Sync user → form */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* 💾 UPDATE PROFIL */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = sessionStorage.getItem("auth_token");
      const storedUser = JSON.parse(
        sessionStorage.getItem("user") || "{}"
      );

      if (!token || !storedUser?.id) {
        throw new Error("Utilisateur non authentifié");
      }

      const payload: Record<string, string> = {
        name: formData.name,
        phone: formData.phone,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch(
        `${API_BASE_URL}/users/${storedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      const updatedUser = await res.json();
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès ✅",
      });
    } catch (error) {
      console.error("Erreur profil :", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  /* ⏳ LOADING */
  if (loading) {
    return <div className="p-6">Chargement du profil...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 text-red-500">
        Utilisateur non connecté.
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-muted/50">
      <ClientSidebar />

      <div className="flex-1 ml-[250px]">
        <AppHeader />

        <main className="p-6 space-y-6">
          {/* 👤 HEADER PROFIL */}
          <Card>
            <CardContent className="flex items-center gap-6 py-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold uppercase">
                {formData.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div>
                <p className="text-lg font-semibold">
                  {formData.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-600" />
                  {formData.phone || "Non défini"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ✏️ FORMULAIRE */}
          <Card>
            <CardHeader>
              <CardTitle>Modifier mes informations</CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      handleChange("name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={formData.email}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleChange("password", e.target.value)
                    }
                    placeholder="Laisser vide pour ne pas changer"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Confirmer le mot de passe</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="md:col-span-2 text-right">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 🆘 SUPPORT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">
              Besoin d’aide ?
            </h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Email : contact@sinmat.ma</li>
              <li>Téléphone : +212 6 69487597</li>
              <li>
                Lun–Ven : 9h–18h | Samedi : 9h–13h
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
