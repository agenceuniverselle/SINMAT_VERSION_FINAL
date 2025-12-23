import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import ContactAndNewsletter from "./ContactAndNewsletter";

export default function MessagesAdminPage() {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      {/* 🔵 SIDEBAR */}
      <AppSidebar />

      {/* 🔵 CONTENU PRINCIPAL */}
      <div className="flex-1 min-h-screen ml-[80px] lg:ml-[250px] transition-all">
        {/* 🔵 HEADER */}
        <AppHeader />

        {/* 🔵 CONTENU PAGE */}
        <main className="p-6">
          <ContactAndNewsletter />
        </main>
      </div>
    </div>
  );
}
