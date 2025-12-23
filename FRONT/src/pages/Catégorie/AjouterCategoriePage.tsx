import { AddCategoryModal } from "@/components/Categories/AddCategoryModal";
import { useState } from "react";

export default function AjouterCategoriePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-6">
      <AddCategoryModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
