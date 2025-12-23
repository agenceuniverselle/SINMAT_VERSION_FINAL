import { useEffect, useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from 'react-router-dom';

type User = {
  name: string;
  email: string;
};

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
async function handleLogout() {
const token = sessionStorage.getItem("auth_token");

  try {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Erreur lors de la déconnexion :", err);
  }

  // Nettoyage local

sessionStorage.removeItem("auth_token");
sessionStorage.removeItem("user");

  // Redirection
  window.location.href = "/";
}

useEffect(() => {
  const storedUser = sessionStorage.getItem("user"); 
  if (storedUser && storedUser !== "undefined") {
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Échec du parsing JSON :", error);
      setUser(null);
    }
  }
}, []);


  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-white">
          {user ? getInitials(user.name) : "?"}
        </span>
        <span className="block mr-1 font-medium text-theme-sm">
          {user?.name ?? "Utilisateur"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.name ?? "Nom Prénom"}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email ?? "email@example.com"}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
  <li>
    <DropdownItem
      onItemClick={closeDropdown}
      tag="a"
      to={
        user?.email === "contact@sinmat.ma"
          ? "/profile"          // admin
          : "/Client-profile"   // client
      }
      className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
    >
      <span>📝</span>
      {user?.email === "contact@sinmat.ma" ? "Edit Admin Profile" : "Edit Client Profile"}
    </DropdownItem>
  </li>
</ul>


        <button
  onClick={handleLogout}
  className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
>
  <span>🚪</span>
  Sign out
</button>

      </Dropdown>
    </div>
  );
}
