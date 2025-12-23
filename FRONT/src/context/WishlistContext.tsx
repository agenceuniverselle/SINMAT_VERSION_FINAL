// src/contexts/WishlistContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/utils/wishlistUtils";

type WishlistContextType = {
  wishlist: number[];
  count: number;
  add: (id: number) => void;
  remove: (id: number) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<number[]>(getWishlist());

  useEffect(() => {
    const listener = () => {
      setWishlist(getWishlist()); // in case of changes from other tabs
    };

    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  const add = (id: number) => {
    addToWishlist(id);
    setWishlist(getWishlist());
  };

  const remove = (id: number) => {
    removeFromWishlist(id);
    setWishlist(getWishlist());
  };

  return (
    <WishlistContext.Provider value={{ wishlist, count: wishlist.length, add, remove }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
