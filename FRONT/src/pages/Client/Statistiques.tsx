import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import AppHeader from "@/layout/AppHeader";
import ClientSidebar from "@/layout/ClientSidebar";

/* ✅ API centralisée */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  created_at: string;
  status: string;
  total: number;
  address: string;
  phone: string;
  items: OrderItem[];
};

type MonthlyData = {
  mois: string;
  commandes: number;
  montant: number;
};

export default function Statistiques() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyData[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [averageBasket, setAverageBasket] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const token = sessionStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/mes-commandes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erreur de chargement");

        const data: Order[] = await res.json();
        setOrders(data);
        processStats(data);
      } catch (err) {
        console.error("Erreur statistiques :", err);
      }
    };

    fetchStats();
  }, []);

  const processStats = (orders: Order[]) => {
    const months = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
      "Jul", "Août", "Sep", "Oct", "Nov", "Déc",
    ];

    const monthlyMap: Record<
      string,
      { commandes: number; montant: number }
    > = {};

    let spent = 0;

    orders.forEach((order) => {
      const monthIndex = new Date(order.created_at).getMonth();
      const mois = months[monthIndex];

      if (!monthlyMap[mois]) {
        monthlyMap[mois] = { commandes: 0, montant: 0 };
      }

      monthlyMap[mois].commandes += 1;
      monthlyMap[mois].montant += Number(order.total);
      spent += Number(order.total);
    });

    const monthlyData: MonthlyData[] = months.map((mois) => ({
      mois,
      commandes: monthlyMap[mois]?.commandes || 0,
      montant: monthlyMap[mois]?.montant || 0,
    }));

    setMonthlyStats(monthlyData);
    setTotalOrders(orders.length);
    setTotalSpent(spent);
    setAverageBasket(orders.length ? spent / orders.length : 0);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />

      <div className="flex-1 ml-[250px]">
        <AppHeader />

        <main className="p-6 space-y-6">
          {/* 📊 Nombre de commandes */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution du nombre de commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="commandes"
                    fill="hsl(var(--primary))"
                    name="Commandes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 📈 Dépenses */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des dépenses mensuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="montant"
                    stroke="hsl(var(--primary))"
                    name="Montant (MAD)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 📌 Résumé */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Total commandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalOrders}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Dépenses totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {totalSpent.toFixed(2)} MAD
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Panier moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {averageBasket.toFixed(2)} MAD
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
