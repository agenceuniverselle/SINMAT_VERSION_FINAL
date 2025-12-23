import {
  Construction,
  Hammer,
  Bolt,
  Settings,
  Drill,
  Zap,
  Wrench,
  Waves,
  HardHat,
  Boxes,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const locationCategories = [
  { name: "Mini-pelles", count: "5 équipements", icon: Construction, value: "excavation" },
  { name: "Marteaux piqueurs", count: "8 équipements", icon: Hammer, value: "demolition" },
  { name: "Compacteurs", count: "6 équipements", icon: Bolt, value: "compaction" },
  { name: "Échafaudages", count: "4 équipements", icon: Settings, value: "scaffolding" },
  { name: "Scies & découpeuses", count: "7 équipements", icon: Drill, value: "cutting" },
  { name: "Groupes électrogènes", count: "3 équipements", icon: Zap, value: "power" },
  { name: "Bétonnières", count: "9 équipements", icon: Wrench, value: "concrete" },
  { name: "Pompes à eau", count: "5 équipements", icon: Waves, value: "pumps" },
  { name: "Équipement de chantier", count: "12 équipements", icon: HardHat, value: "tools" },
  { name: "Matériel divers", count: "10 équipements", icon: Boxes, value: "other" },
];

interface Props {
  selectedCategory: string | null;
  onSelect: (value: string | null) => void;
}

const LocationCategories = ({ selectedCategory, onSelect }: Props) => {
  return (
  <section className="bg-gradient-to-br from-gray-500 via-gray-600 to-black py-12">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">
      Catégories de Matériel
    </h2>

    <p className="text-lg text-gray-300 max-w-2xl mx-auto text-center mb-4">
      Louez votre matériel BTP en toute simplicité. Livraison sur Tanger et régions.
    </p>

    {/* Bouton centré */}
    <div className="flex justify-center mb-10">
  <a href="/location#Demande-devis">
    <Button size="lg" className="gap-2">
      Demander un devis
      <Phone className="h-5 w-5" />
    </Button>
  </a>
</div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {locationCategories.map((category) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.value;

        return (
          <div
            key={category.value}
            onClick={() => onSelect(isActive ? null : category.value)}
            className={`group p-4 rounded-lg text-center cursor-pointer transition-all duration-200
              ${isActive ? "bg-[#3c3c3c] border border-[#ff6a00]" : "bg-white text-black hover:shadow-md"}
            `}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full 
                  ${isActive ? "bg-[#ff6a00]/20 text-[#ff6a00]" : "bg-[#ff6a00]/10 text-[#ff6a00]"}
                `}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={`font-semibold text-sm ${isActive ? "text-white" : "text-black"}`}>
                {category.name}
              </h3>
              <p className={`text-xs ${isActive ? "text-gray-400" : "text-gray-500"}`}>
                {category.count}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

  );
};

export default LocationCategories;
