// 📁 src/layout/ClientSidebar.tsx

import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  PackageIcon,
  BarChart2Icon,
  UserIcon,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const navItems = [
  {
    icon: <HomeIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
    name: "Accueil",
    path: "/dashboard-client",
  },
  {
    icon: <PackageIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
    name: "Mes commandes",
    path: "/client/commandes",
  },
  {
    icon: <BarChart2Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
    name: "Statistiques",
    path: "/client/statistiques",
  },
 
];

const ClientSidebar = () => {
  const location = useLocation();
  const { isExpanded, isMobileOpen } = useSidebar();

  const sidebarWidth = isMobileOpen
    ? "w-[250px]"
    : isExpanded
    ? "w-[250px]"
    : "w-[80px]";

  const showText = isExpanded || isMobileOpen;

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        px-4 py-6 transition-all duration-300 z-50
        ${sidebarWidth}
      `}
    >
      {/* Logo / Titre */}
      <div className="mb-8 flex items-center gap-3">
        <img src="/favicon.png" className="w-8 h-8" />
        {showText && (
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Client-Dashboard
          </span>
        )}
      </div>

      {/* Menu */}
      {showText && (
        <h3 className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-3 px-2">
          Menu
        </h3>
      )}
      <ul className="flex flex-col gap-1">
        {navItems.map((nav) => (
          <li key={nav.name}>
            <Link
              to={nav.path}
              className={`
                flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all
                ${
                  isActive(nav.path)
                    ? "text-blue-600 dark:text-blue-400 font-semibold bg-gray-100 dark:bg-gray-800"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              <span className="size-5">{nav.icon}</span>
              {showText && nav.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ClientSidebar;
