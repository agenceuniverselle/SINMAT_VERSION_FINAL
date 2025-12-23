import { AddProductModal } from "@/components/Produit/AddProductModal";
import { useState } from "react";

export default function AjouterProduitPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-6">
      <AddProductModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
