import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Toy, ReservationStatus } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (toy: Toy) => void;
  removeFromCart: (toyId: string) => void;
  updateStatus: (toyId: string, status: ReservationStatus) => void;
  rateItem: (toyId: string, ocena: number) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (toy: Toy) => {
    if (items.find((i) => i.toyId === toy.id)) return;
    setItems((prev) => [
      ...prev,
      {
        toyId: toy.id,
        toy,
        status: 'rezervisano',
        datumRezervacije: new Date().toISOString(),
      },
    ]);
  };

  const removeFromCart = (toyId: string) => {
    setItems((prev) => prev.filter((i) => i.toyId !== toyId));
  };

  const updateStatus = (toyId: string, status: ReservationStatus) => {
    setItems((prev) =>
      prev.map((i) => (i.toyId === toyId ? { ...i, status } : i))
    );
  };

  const rateItem = (toyId: string, ocena: number) => {
    setItems((prev) =>
      prev.map((i) => (i.toyId === toyId ? { ...i, ocena } : i))
    );
  };

  const cartCount = items.filter((i) => i.status !== 'otkazano').length;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateStatus, rateItem, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
