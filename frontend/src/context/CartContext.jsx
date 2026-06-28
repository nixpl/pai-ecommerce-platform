import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as ordersApi from '../api/orders';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await ordersApi.fetchCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (variantId, quantity = 1) => {
    const data = await ordersApi.addCartItem(variantId, quantity);
    setCart(data);
    return data;
  }, []);

  const updateItem = useCallback(async (variantId, quantity) => {
    const data = await ordersApi.updateCartItem(variantId, quantity);
    setCart(data);
    return data;
  }, []);

  const removeItem = useCallback(async (variantId) => {
    const data = await ordersApi.removeCartItem(variantId);
    setCart(data);
    return data;
  }, []);

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        refreshCart,
        addItem,
        updateItem,
        removeItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
