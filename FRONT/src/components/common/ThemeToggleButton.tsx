import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Debug
  console.log("ThemeToggleButton rendu");
  console.log("Affichage du bouton, isDark =", isDark);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full border border-red-500 bg-yellow-100"
      title="Changer le thème"
    >
      {isDark ? (
        <Sun className="w-10 h-10 text-black" />
      ) : (
        <Moon className="w-10 h-10 text-black" />
      )}
    </button>
  );
}
