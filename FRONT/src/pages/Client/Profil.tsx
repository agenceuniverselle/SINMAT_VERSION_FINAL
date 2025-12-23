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

  // ✅ Synchroniser les données une fois user chargé
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = sessionStorage.getItem("auth_token");
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

      const payload: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch(`http://localhost:8000/api/users/${storedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

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
      console.error("Erreur de mise à jour :", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  // ✅ État de chargement
  if (loading) {
    return <div className="p-6">Chargement du profil...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-500">Utilisateur non connecté.</div>;
  }

  return (
    <div className="flex min-h-screen bg-muted/50">
      <ClientSidebar />

      <div className="flex-1 ml-[250px]">
        <AppHeader />

        <main className="p-6 space-y-6">
          {/* 🧑‍💼 Header Profil */}
          <Card>
            <CardContent className="flex items-center gap-6 py-6">
<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-black uppercase">
  {formData.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)}
</div>
              <div>
                <p className="text-lg font-semibold">{formData.email}</p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-600" />
                  {formData.phone || "Non défini"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 📝 Formulaire de modification */}
          <Card>
            <CardHeader>
              <CardTitle>Modifier mes informations</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    readOnly
                    className="bg-[#f5f8ff] cursor-not-allowed"
                  />
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Laisser vide pour ne pas changer"
                  />
                </div>

                {/* Confirmation */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="confirmPassword">Confirmer mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  />
                </div>

                {/* Bouton */}
                <div className="md:col-span-2 text-right">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          {/* 🔷 SUPPORT SECTION */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Besoin d’aide ?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Pour toute question ou problème, contactez-nous :
            </p>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
              <li>Email : contact@sinmat.ma</li>
              <li>Téléphone : +212 6 69487597</li>
              <li>Disponible : Lundi à Vendredi, 9h à 18h - Samedi: 9h à 13h</li>
         

            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
