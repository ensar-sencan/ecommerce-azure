import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (productId: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => set((s) => {
        const existing = s.items.find(i => i.productId === item.productId);
        if (existing) {
          return { items: s.items.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i) };
        }
        return { items: [...s.items, { ...item, quantity: 1 }] };
      }),

      remove: (productId) => set((s) => ({ items: s.items.filter(i => i.productId !== productId) })),

      updateQty: (productId, quantity) => set((s) => ({
        items: quantity <= 0
          ? s.items.filter(i => i.productId !== productId)
          : s.items.map(i => i.productId === productId ? { ...i, quantity } : i),
      })),

      clear: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-store' }
  )
);
