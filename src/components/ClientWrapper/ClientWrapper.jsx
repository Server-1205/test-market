"use client";
import { CartProvider } from "@/contexts/CartContext";

const ClientWrapper = ({ children }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default ClientWrapper;
