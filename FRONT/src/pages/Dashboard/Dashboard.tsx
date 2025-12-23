import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";

import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";

// --- Données mockées ---
const salesData = [
  { name: "Lun", ventes: 4200, locations: 2400 },
  { name: "Mar", ventes: 3800, locations: 2210 },
  { name: "Mer", ventes: 5200, locations: 2900 },
  { name: "Jeu", ventes: 4500, locations: 2500 },
  { name: "Ven", ventes: 6800, locations: 3200 },
  { name: "Sam", ventes: 7200, locations: 3800 },
  { name: "Dim", ventes: 5900, locations: 3100 },
];

const ordersData = [
  { name: "Sem 1", recues: 45, livrees: 42 },
  { name: "Sem 2", recues: 52, livrees: 48 },
  { name: "Sem 3", recues: 61, livrees: 58 },
  { name: "Sem 4", recues: 58, livrees: 55 },
];

const messagesData = [
  { name: "Lun", messages: 12 },
  { name: "Mar", messages: 19 },
  { name: "Mer", messages: 15 },
  { name: "Jeu", messages: 22 },
  { name: "Ven", messages: 28 },
  { name: "Sam", messages: 18 },
  { name: "Dim", messages: 14 },
];

const newsletterData = [
  { name: "Jan", abonnes: 120 },
  { name: "Fév", abonnes: 145 },
  { name: "Mar", abonnes: 178 },
  { name: "Avr", abonnes: 210 },
  { name: "Mai", abonnes: 245 },
  { name: "Jun", abonnes: 289 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ title, value, icon: Icon, trend }: any) => (
   
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-1">
          {trend > 0 ? "+" : ""}
          {trend}% vs mois dernier
        </p>
      )}
    </CardContent>
  </Card>
);

export default function DashboardPage() {
    // Données produits
const [categoryData, setCategoryData] = useState([]);

useEffect(() => {
  const fetchCategoryStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/produits/stats/categorie");
      const result = await response.json();

      // ✅ Génère une couleur HSL unique par catégorie (ex: 10 catégories → 10 couleurs espacées)
   const generateColors = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const hue = Math.round((360 / count) * i); // teinte unique
    return `hsl(${hue}, 60%, 60%)`; // ✅ saturation plus basse, luminosité moyenne
  });
};


      const colors = generateColors(result.length);

      const formatted = result.map((item, index) => ({
        name: item.categorie,
        value: item.total,
        color: colors[index],
      }));

      setCategoryData(formatted);
    } catch (error) {
      console.error("Erreur chargement stats catégorie:", error);
    }
  };

  fetchCategoryStats();
}, []);
const [newsletterData, setNewsletterData] = useState([]);

useEffect(() => {
  const fetchNewsletterStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/newsletter/stats");
      const result = await response.json();

      // Formatage facultatif si nécessaire
      const formatted = result.map(item => ({
        name: item.mois,
        abonnes: item.total
      }));

      setNewsletterData(formatted);
    } catch (error) {
      console.error("Erreur chargement stats newsletter:", error);
    }
  };

  fetchNewsletterStats();
}, []);
const [messageData, setMessageData] = useState([]);

useEffect(() => {
  const fetchMessageStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/messages/stats");
      const result = await response.json();
      setMessageData(result);
    } catch (error) {
      console.error("Erreur chargement stats messages:", error);
    }
  };

  fetchMessageStats();
}, []);


  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      
      {/* 🔵 SIDEBAR */}
      <AppSidebar />

      {/* 🔵 CONTENU PRINCIPAL */}
      <div className="flex-1 min-h-screen ml-[80px] lg:ml-[250px] transition-all">
        
        {/* 🔵 HEADER */}
        <AppHeader />

        {/* 🔵 CONTENU PAGE DASHBOARD */}
        <main className="p-6 space-y-6">
          {/* Cartes Statistiques */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Ventes totales" value="42 850 MAD" icon={TrendingUp} trend={12.5} />
            <StatCard title="Commandes" value="216" icon={ShoppingCart} trend={8.2} />
            <StatCard title="Produits" value="1,247" icon={Package} trend={-2.1} />
            <StatCard title="Messages" value="128" icon={MessageSquare} trend={15.3} />
          </div>

          {/* Ventes et Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Ventes et Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="semaine">
                <TabsList>
                  <TabsTrigger value="semaine">Semaine</TabsTrigger>
                  <TabsTrigger value="mois">Mois</TabsTrigger>
                </TabsList>
                <TabsContent value="semaine" className="mt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))"
                      }} />
                      <Legend />
                      <Line type="monotone" dataKey="ventes" stroke="hsl(var(--primary))" strokeWidth={2} name="Ventes (MAD)" />
                      <Line type="monotone" dataKey="locations" stroke="hsl(220 70% 50%)" strokeWidth={2} name="Locations (MAD)" />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="mois">
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    Vue mensuelle disponible prochainement
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Commandes */}
            <Card>
              <CardHeader>
                <CardTitle>Commandes Reçues vs Livrées</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ordersData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))"
                    }} />
                    <Legend />
                    <Bar dataKey="recues" fill="hsl(var(--primary))" name="Reçues" />
                    <Bar dataKey="livrees" fill="hsl(220 70% 50%)" name="Livrées" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Messages */}
           <Card>
  <CardHeader>
    <CardTitle>Messages du Formulaire</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={messageData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        />
        <Bar
          dataKey="messages"
          fill="hsl(var(--destructive))"
          name="Messages"
        />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

          </div>

          {/* Newsletter */}
          <Card>
  <CardHeader>
    <CardTitle>Évolution des Abonnés Newsletter</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={newsletterData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip contentStyle={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))"
        }} />
        <Line
          type="monotone"
          dataKey="abonnes"
          stroke="hsl(220 70% 50%)"
          strokeWidth={2}
          name="Abonnés"
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

          {/* Répartition des Produits par Catégorie */}
<Card>
  <CardHeader>
    <CardTitle>Répartition des Produits par Catégorie</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </CardContent>
</Card>


        </main>
      </div>
    </div>
  );
}
