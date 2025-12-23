// src/pages/Dashboard/EditProfilePage.tsx

import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

type User = {
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
  image?: string; // optionnel
};

export default function EditProfilePage() {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    phone: "06 00 00 00 00",
    created_at: "2023-01-01",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
  const storedUser = sessionStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed); // name, email, phone, etc.
    } catch (error) {
      console.error("Impossible de parser le user :", error);
    }
  }
}, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  try {
const token = sessionStorage.getItem("auth_token");
const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");


    const payload: Record<string, string> = {
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
    };

    // Ajouter le mot de passe uniquement s'il est modifié
    if (password) {
      payload.password = password;
    }

    const res = await fetch(`http://localhost:8000/api/users/${storedUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ Auth avec Sanctum
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erreur de mise à jour");

    const updatedUser = await res.json();

    // Met à jour le localStorage
sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert("Profil mis à jour avec succès !");
    setPassword("");
    setConfirmPassword("");
  } catch (error) {
    console.error("Erreur de mise à jour :", error);
    alert("Une erreur est survenue.");
  }
};


  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <AppSidebar />

      <div className="flex-1 min-h-screen ml-[80px] lg:ml-[250px] transition-all">
        <AppHeader />

        <main className="p-6 space-y-6">
          {/* 🔷 PROFILE CARD */}
          <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-white overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 w-full">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
              <p className="text-gray-500 dark:text-gray-300 mt-1">
                📞 {user.phone}
              </p>
<p className="text-gray-400 text-sm mt-1">
  Créé le : {user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "N/A"}
</p>

              {/* Actions */}
            
            </div>
          </div>

          {/* 🔷 FORMULAIRE DE MODIFICATION */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmer mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Enregistrer
              </button>
            </div>
          </form>

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
