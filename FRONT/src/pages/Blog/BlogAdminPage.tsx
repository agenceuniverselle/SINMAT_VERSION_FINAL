import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import BlogTable from "@/components/Blog/BlogTable";

export default function BlogAdminPage() {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      
      {/* 🔵 SIDEBAR */}
      <AppSidebar />

      {/* 🔵 CONTENU PRINCIPAL */}
      <div className="flex-1 min-h-screen ml-[80px] lg:ml-[250px] transition-all">
        
        {/* 🔵 HEADER */}
        <AppHeader />

        {/* 🔵 PAGE CONTENT */}
        <main className="p-6">
          <BlogTable />
        </main>
      </div>
    </div>
  );
}
