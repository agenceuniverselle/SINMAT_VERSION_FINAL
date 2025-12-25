import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, Mail, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppHeader from "@/layout/AppHeader";
import ClientSidebar from "@/layout/ClientSidebar";

/* ✅ API dynamique */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
type Order = {
  id: number;
  created_at: string;
  status: string;
  total: number;
};

/* ================= STAT CARD ================= */
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

/* ================= DASHBOARD ================= */
export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  /* 🔔 NEWSLETTER STATUS */
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const token = sessionStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/newsletter/is-subscribed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setIsSubscribed(Boolean(data.subscribed));
      } catch (error) {
        console.error("Erreur newsletter :", error);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  /* 📦 COMMANDES */
  useEffect(() => {
    const fetchOrders = async () => {
      const token = sessionStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/mes-commandes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Erreur commandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ================= CALCULS ================= */
  const totalOrders = orders.length;

  const totalInProgress = orders.filter((o) =>
    ["en cours", "En cours"].includes(o.status)
  ).length;

  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.total),
    0
  );

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />

      <div className="flex-1 ml-[250px]">
        <AppHeader />

        <main className="p-6 space-y-6">
          {/* 🔢 STATISTIQUES */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Commandes"
              value={totalOrders}
              icon={ShoppingCart}
              color="text-primary"
            />

            <StatCard
              title="En cours"
              value={totalInProgress}
              icon={Package}
              color="text-orange-500"
            />

            <StatCard
              title="Dépenses totales"
              value={`${totalSpent.toFixed(2)} MAD`}
              icon={TrendingUp}
              color="text-green-500"
            />

            <StatCard
              title="Newsletter"
              value={isSubscribed ? "Abonné" : "Non abonné"}
              icon={Mail}
              color={isSubscribed ? "text-blue-500" : "text-gray-400"}
            />
          </div>

          {/* 🧾 COMMANDES RÉCENTES */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Commandes récentes</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/client/commandes">Voir tout</Link>
              </Button>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Chargement...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-muted-foreground">
                  Aucune commande trouvée.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div>
                        <p className="font-medium">CMD-{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.created_at}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          {order.total.toFixed(2)} MAD
                        </p>
                        <p
                          className={`text-sm ${
                            order.status === "Livrée"
                              ? "text-green-600"
                              : order.status === "Expédiée"
                              ? "text-blue-600"
                              : "text-orange-600"
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ⚡ ACTIONS RAPIDES */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition">
              <Link to="/client/commandes">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Gérer mes commandes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Consultez l’historique et le suivi de vos commandes
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition">
              <Link to="/Client-profile">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Mon profil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Modifiez vos informations personnelles
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
