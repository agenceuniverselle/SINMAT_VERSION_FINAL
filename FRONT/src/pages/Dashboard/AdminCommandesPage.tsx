import { useState } from "react";
import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import AdminCommandes from "./AdminCommandes";
import AdminLocations from "./AdminLocations"; // 👈 importe ton composant de location
import { Button } from "@/components/ui/button";

export default function AdminCommandesPage() {
  const [activeTab, setActiveTab] = useState<"ventes" | "locations">("ventes");

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      {/* 🔵 Sidebar */}
      <AppSidebar />

      {/* 🔵 Contenu principal */}
      <div className="flex-1 min-h-screen ml-[80px] lg:ml-[250px] transition-all">
        {/* 🔵 Header */}
        <AppHeader />

        {/* 🔵 Contenu page */}
        <main className="p-6 space-y-6">
          {/* 🟠 Boutons switch */}
          <div className="flex gap-4 mb-4">
            <Button
              variant={activeTab === "ventes" ? "default" : "outline"}
              onClick={() => setActiveTab("ventes")}
            >
              Commandes de vente
            </Button>
            <Button
              variant={activeTab === "locations" ? "default" : "outline"}
              onClick={() => setActiveTab("locations")}
            >
              Demandes de location
            </Button>
          </div>

          {/* 🟠 Affichage conditionnel */}
          {activeTab === "ventes" && <AdminCommandes />}
          {activeTab === "locations" && <AdminLocations />}
        </main>
      </div>
    </div>
  );
}
