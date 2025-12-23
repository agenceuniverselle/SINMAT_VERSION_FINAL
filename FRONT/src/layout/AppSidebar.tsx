import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  AddProductIcon,
  AddCategoriesicon,
  TimeIcon,
  DocsIcon,
  MailIcon,
  CheckLineIcon
} from "../icons";

import { useSidebar } from "../context/SidebarContext";

// Import modals
import { AddProductModal } from "@/components/Produit/AddProductModal";
import { AddCategoryModal } from "@/components/Categories/AddCategoryModal";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard-admin",
  },
  {
  icon: <AddProductIcon />,
  name: "Produit",
  path: "/produits", // 👈 Lien vers la page des produits
},

{
    icon: <AddCategoriesicon className="w-5 h-5 text-gray-600" />,
    name: "Categorie_produit_vente",
    path: "/Admin-categories",// 👈 Utilisé pour ouvrir un modal
},
{
    icon: <TimeIcon className="w-5 h-5 text-gray-600" />,
    name: "Location",
    path: "/Admin-Location",// 👈 Utilisé pour ouvrir un modal
},
{
    icon: <DocsIcon className="w-5 h-5 text-gray-600" />,
    name: "Blog",
    path: "/Admin-Blog",// 👈 Utilisé pour ouvrir un modal
},
  { icon: <MailIcon />, name: "Messages", path: "/Messages" },
    { icon: <CheckLineIcon className="w-5 h-5 text-gray-600"/>, name: "Commandes", path: "/admin-commandes" },

  { icon: <UserCircleIcon />, name: "Utilisateurs", path: "/admin-utilisateurs" },

    {/*{ icon: <CalenderIcon />, name: "Calendar", path: "/calendar" },*/}

];

{/*const othersItems = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "line-chart" },
      { name: "Bar Chart", path: "bar-chart" },
    ],
  },
];
*/}
const AppSidebar = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // 🔥 States pour les modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const isActive = useCallback(
    (path: string) => location.pathname.endsWith(path),
    [location.pathname]
  );

  const handleSubmenuToggle = (name: string) => {
    setOpenSubmenu(prev => (prev === name ? null : name));
  };

  const sidebarWidth = isMobileOpen
    ? "w-[250px]"
    : isExpanded
    ? "w-[250px]"
    : "w-[80px]"; // MODE RÉDUIT

  const showText = isExpanded || isMobileOpen;

  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-1">
      {items.map(nav => (
        <li key={nav.name}>
          {/* 🔥 1 — Items avec sous menus */}
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(nav.name)}
                className="
                  flex items-center gap-3 px-3 py-2 text-sm w-full rounded-md 
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-800
                "
              >
                <span className="size-5">{nav.icon}</span>
                {showText && nav.name}
                {showText && (
                  <ChevronDownIcon
                    className={`ml-auto w-4 h-4 transition-transform ${
                      openSubmenu === nav.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {showText && (
                <ul
                  className={`
                    ml-10 mt-1 flex flex-col gap-1 overflow-hidden transition-all
                    ${openSubmenu === nav.name ? "max-h-40" : "max-h-0"}
                  `}
                >
                  {nav.subItems.map(sub => (
                    <li key={sub.path}>
                      <Link
                        to={sub.path}
                        className={`
                          text-sm px-2 py-1 block rounded transition-colors
                          ${
                            isActive(sub.path)
                              ? "text-blue-500 dark:text-blue-400 font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          }
                        `}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (

            /* 🔥 2 — Items spéciaux (AJOUT PRODUIT / AJOUT CATEGORIE) */
            nav.actionType === "add-product" ? (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="
                  flex items-center gap-3 px-3 py-2 text-sm rounded-md w-full text-left
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-800
                "
              >
                <span className="size-5">{nav.icon}</span>
                {showText && nav.name}
              </button>
            ) : nav.actionType === "add-category" ? (
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="
                  flex items-center gap-3 px-3 py-2 text-sm rounded-md w-full text-left
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-800
                "
              >
                <span className="size-5">{nav.icon}</span>
                {showText && nav.name}
              </button>
            ) : (

              /* 🔥 3 — Items classiques avec path */
              <Link
                to={nav.path}
                className={`
                  flex items-center gap-3 px-3 py-2 text-sm rounded-md
                  ${
                    isActive(nav.path)
                      ? "text-blue-500 dark:text-blue-400 font-semibold bg-gray-100 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <span className="size-5">{nav.icon}</span>
                {showText && nav.name}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* ⭐ SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          px-4 py-6 transition-all duration-300 z-50
          ${sidebarWidth}
        `}
      >
        <div className="mb-8 flex items-center gap-3">
          <img src="/favicon.png" className="w-8 h-8" />
          {showText && (
            <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Admin-Dashboard
            </span>
          )}
        </div>

        {showText && (
          <h3 className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-3 px-2">
            Menu
          </h3>
        )}
        {renderMenuItems(navItems)}

        {/*{showText && (
          <h3 className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mt-6 mb-3 px-2">
            Others
          </h3>
        )}
        {renderMenuItems(othersItems)}*/}
      </aside>



    </>
  );
};

export default AppSidebar;
