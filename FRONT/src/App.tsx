import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

// ✅ Website Pages (Frontend)
import Index from "./pages/Index";
import ContactUs from "./pages/Contact/ContactUs";
import FAQs from "./pages/FAQS/FAQs";
import About from "./pages/About-us/About";
import Register from "./pages/Authentification/Register";
import NotFound from "./pages/NotFound";

// ✅ Legal Pages
import LegalMentions from "./components/Légal/LegalMentions";
import ConditionsGeneralesDeVentePage from "./components/Légal/ConditionsGeneralesDeVentePage";
import PolitiqueDeConfidentialitePage from "./components/Légal/PolitiqueDeConfidentialitePage";
import PolitiqueDesCookiesPage from "./components/Légal/PolitiqueDesCookiesPage";

// ✅ Boutique & Produits
import Shop from "./pages/Produits/Shop";
import ProductDetail from "./pages/Produits/ProductDetail";
import ProduitsPage from "./pages/Produits/ProduitsPage";
import AjouterProduitPage from "./pages/Produits/AjouterProduitPage";
import ProductDetailsPage from "./pages/Produits/ProductDetailsPage";
import ProductTable from "./components/Produit/ProductTable"; 

// ✅ Catégories
import AjouterCategoriePage from "./pages/Catégorie/AjouterCategoriePage";
import CategoriesPage from "./pages/Catégorie/CategoriesPage";

// ✅ Location (Location de produits)
import Location from "./pages/Location/Location";
import LocationCategoriesPage from "./pages/Location/LocationCategoriesPage";
import LocationProductsPage from "./pages/Location/LocationProductsPage";

// ✅ Blog
import Blog from "./pages/Blog/Blog";
import BlogPost from "./pages/Blog/BlogPost";
import BlogAdminPage from "./pages/Blog/BlogAdminPage";

// ✅ Dashboard Layout
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Utilisateurs from "./pages/Dashboard/Utilisateurs";
import UtilisateurAdminPage from "./pages/Dashboard/UtilisateurAdminPage";
import MessagesAdminPage  from "./pages/Dashboard/MessagesAdminPage";
import UserDetails from "./pages/Dashboard/UserDetails";
import UtilisateurDetailsPage from "./pages/Dashboard/UtilisateurDetailsPage";
import EditProfilePage from "./pages/Dashboard/EditProfilePage";
import WishlistPage from "./components/Wishlist/WishlistPage";
import CheckoutPage from "./pages/Checkout";
import AdminCommandesPage from "./pages/Dashboard/AdminCommandesPage";
// ✅ Client Pages
import ClientCommandes from "./pages/Client/Commandes";
import ClientDashboard from "./pages/Client/Dashboard";
import ClientProfil from "./pages/Client/Profil";
import ClientStatistiques from "./pages/Client/Statistiques";


// ✅ React Query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      {/* 📌 Routing (BrowserRouter est déjà dans main.tsx) */}
      <Routes>
        {/* 🌐 Public Website */}
        <Route path="/" element={<Index />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/register" element={<Register />} />

        {/* 📄 Legal Pages */}
        <Route path="/mentions-legales" element={<LegalMentions />} />
        <Route path="/conditions-generales-de-vente" element={<ConditionsGeneralesDeVentePage />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueDeConfidentialitePage />} />
        <Route path="/politique-des-cookies" element={<PolitiqueDesCookiesPage />} />

        {/* 🛍️ Boutique & Produits */}
        <Route path="/catalogue" element={<Shop />} />
        <Route path="/catalogue/product/:id" element={<ProductDetail />} />
        <Route path="/produits" element={<ProduitsPage />} />
        <Route path="/produits/:id/details" element={<ProductDetailsPage />} />
        <Route path="/ajouter-produit" element={<AjouterProduitPage />} />

        {/* 🗂️ Catégories */}
        <Route path="/ajouter-categorie" element={<AjouterCategoriePage />} />
        <Route path="/admin-categories" element={<CategoriesPage />} />

        {/* 🛠️ Location */}
        <Route path="/location" element={<Location />} />
        <Route path="/admin-location" element={<LocationCategoriesPage />} />
        <Route path="/ajouter-produit-location" element={<LocationProductsPage />} />

        {/* 📰 Blog */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/admin-blog" element={<BlogAdminPage />} />

        {/* 🧩 Dashboard Root Layout (vide pour l’instant) */}
        <Route path="/admin/" element={<AppLayout />}></Route>
        <Route path="/dashboard-admin" element={<Dashboard />}></Route>
        <Route path="/admin-utilisateurs" element={<UtilisateurAdminPage />} />
        <Route path="/Messages" element={<MessagesAdminPage />} />
        {/* 🔐 Utilisateur - Détails & Permissions */}
        <Route path="/utilisateurs/:id" element={<UtilisateurDetailsPage />} />
        <Route path="/profile" element={<EditProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin-commandes" element={<AdminCommandesPage />} />
        {/* 👤 Espace Client */}
        <Route path="/client/commandes" element={<ClientCommandes />} />
        <Route path="/dashboard-client" element={<ClientDashboard />} />
        <Route path="/Client-profile" element={<ClientProfil />} />
        <Route path="/client/statistiques" element={<ClientStatistiques />} />
        {/* 🚫 Page 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
