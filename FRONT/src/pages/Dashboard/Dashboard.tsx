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
  PieChart,
  Pie,
  Cell,
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
import { Button } from "@/components/ui/button";

/* =======================
   API CENTRALISÉE
======================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* =======================
   DONNÉES MOCK (GRAPHIQUES)
======================= */
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
      {trend !== undefined && (
        <p className="text-xs text-muted-foreground mt-1">
          {trend > 0 ? "+" : ""}
          {trend}% vs mois dernier
        </p>
      )}
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [newsletterData, setNewsletterData] = useState<any[]>([]);
  const [messageData, setMessageData] = useState<any[]>([]);

  /* =======================
     STATS CATÉGORIES
  ======================= */
  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/produits/stats/categorie`
        );
        const result = await res.json();

        const generateColors = (count: number) =>
          Array.from({ length: count }, (_, i) => {
            const hue = Math.round((360 / count) * i);
            return `hsl(${hue}, 60%, 60%)`;
          });

        const colors = generateColors(result.length);

        setCategoryData(
          result.map((item: any, index: number) => ({
            name: item.categorie,
            value: item.total,
            color: colors[index],
          }))
        );
      } catch (error) {
        console.error("Erreur stats catégories:", error);
      }
    };

    fetchCategoryStats();
  }, []);

  /* =======================
     STATS NEWSLETTER
  ======================= */
  useEffect(() => {
    const fetchNewsletterStats = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/newsletter/stats`
        );
        const result = await res.json();

        setNewsletterData(
          result.map((item: any) => ({
            name: item.mois,
            abonnes: item.total,
          }))
        );
      } catch (error) {
        console.error("Erreur stats newsletter:", error);
      }
    };

    fetchNewsletterStats();
  }, []);

  /* =======================
     STATS MESSAGES
  ======================= */
  useEffect(() => {
    const fetchMessageStats = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/messages/stats`
        );
        const result = await res.json();
        setMessageData(result);
      } catch (error) {
        console.error("Erreur stats messages:", error);
      }
    };

    fetchMessageStats();
  }, []);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      {/* SIDEBAR */}
      <AppSidebar />

      {/* CONTENU */}
      <div className="flex-1 min-h-screen ml-[80px] lg:ml-[250px]">
        <AppHeader />

        <main className="p-6 space-y-6">
          {/* CARTES STATS */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Ventes totales"
              value="42 850 MAD"
              icon={TrendingUp}
              trend={12.5}
            />
            <StatCard
              title="Commandes"
              value="216"
              icon={ShoppingCart}
              trend={8.2}
            />
            <StatCard
              title="Produits"
              value="1 247"
              icon={Package}
              trend={-2.1}
            />
            <StatCard
              title="Messages"
              value="128"
              icon={MessageSquare}
              trend={15.3}
            />
          </div>

          {/* VENTES & LOCATIONS */}
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ventes"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="locations"
                        stroke="hsl(220 70% 50%)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="mois">
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Vue mensuelle bientôt disponible
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* COMMANDES & MESSAGES */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ordersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="recues" fill="hsl(var(--primary))" />
                    <Bar dataKey="livrees" fill="hsl(220 70% 50%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={messageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="messages"
                      fill="hsl(var(--destructive))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* NEWSLETTER */}
          <Card>
            <CardHeader>
              <CardTitle>Abonnés Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={newsletterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="abonnes"
                    stroke="hsl(220 70% 50%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CATÉGORIES */}
          <Card>
            <CardHeader>
              <CardTitle>Produits par Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
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
