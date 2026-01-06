// CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], cart_items: 0, cart_total: 0 });

  const fetchCart = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await axios.get('http://127.0.0.1:8000/store/cart-summary/', {
  headers: { Authorization: `Bearer ${token}` },
});
setCart(res.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  
  const clearCart = () => {
    setCart({ items: [], cart_items: 0, cart_total: 0 });
  };
  // optional helpers
  const getCount = () => cart?.cart_items ?? 0;
  const getTotal = () => cart?.cart_total ?? 0;

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, getCount, getTotal ,clearCart}}>
      {children}
    </CartContext.Provider>
  );
};
