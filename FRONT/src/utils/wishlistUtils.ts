// src/utils/wishlistUtils.ts

const WISHLIST_KEY = "wishlist";

export const getWishlist = (): number[] => {
  const stored = localStorage.getItem(WISHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToWishlist = (productId: number) => {
  const current = getWishlist();
  if (!current.includes(productId)) {
    const updated = [...current, productId];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  }
};

export const removeFromWishlist = (productId: number) => {
  const current = getWishlist().filter((id) => id !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(current));
};
