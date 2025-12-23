import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isMobileOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* SIDEBAR + BACKDROP */}
      <div className="relative z-50">
        <AppSidebar />
        <Backdrop />
      </div>

      {/* MAIN CONTENT */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${
            // Desktop margin-left
            isMobileOpen 
              ? "ml-0" 
              : isExpanded 
                ? "lg:ml-[250px]"
                : "lg:ml-[80px]"
          }
        `}
      >
        {/* TOP HEADER */}
        <AppHeader />

        {/* MAIN UNDER HEADER */}
        <main className="pt-20 p-4 mx-auto w-full max-w-screen-2xl md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
