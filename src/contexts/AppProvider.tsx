import React, { ReactNode } from 'react';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ProductProvider>
      <CartProvider>{children}</CartProvider>
    </ProductProvider>
  );
};