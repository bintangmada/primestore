import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      cart: [], // Ini yang akan dibaca oleh komponen (selalu sinkron dengan user aktif)
      userCarts: {}, // Database lokal: { 'guest': [], '123': [...] }
      currentUserId: 'guest',

      // Actions
      switchUser: (userId) => {
        const uid = userId || 'guest';
        // Simpan keranjang user lama sebelum pindah (opsional, tapi bagus untuk sinkronisasi)
        const currentItems = get().cart;
        const oldUid = get().currentUserId;
        
        set((state) => ({
          userCarts: { ...state.userCarts, [oldUid]: currentItems },
          currentUserId: uid,
          cart: state.userCarts[uid] || [] // Ambil keranjang user baru
        }));
      },

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          let newCart;
          
          if (existing) {
            newCart = state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            newCart = [...state.cart, { ...product, quantity }];
          }

          return {
            cart: newCart,
            userCarts: { ...state.userCarts, [state.currentUserId]: newCart }
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => {
          const newCart = state.cart.filter((item) => item.id !== productId);
          return {
            cart: newCart,
            userCarts: { ...state.userCarts, [state.currentUserId]: newCart }
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const newCart = state.cart.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          );
          return {
            cart: newCart,
            userCarts: { ...state.userCarts, [state.currentUserId]: newCart }
          };
        });
      },

      clearCart: () => {
        set((state) => ({
          cart: [],
          userCarts: { ...state.userCarts, [state.currentUserId]: [] }
        }));
      },
    }),
    {
      name: 'prime-store-v3-carts', // Versi 3 untuk struktur data baru
    }
  )
);

export default useCartStore;
