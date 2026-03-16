import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Cart, CartItem } from '../types';

interface CartState {
  cart: Cart;
  loading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: CartState = {
  cart: {
    items: [],
    total: 0,
    itemCount: 0,
  },
  loading: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.cart.items.findIndex(
        item => item.id === action.payload.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = [...state.cart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity,
        };
      } else {
        newItems = [...state.cart.items, action.payload];
      }

      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        cart: {
          items: newItems,
          total: newTotal,
          itemCount: newItemCount,
        },
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.cart.items.findIndex(item => item.id === itemId);

      if (itemIndex === -1) return state;

      const newItems = [...state.cart.items];
      
      if (quantity <= 0) {
        newItems.splice(itemIndex, 1);
      } else {
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          quantity,
        };
      }

      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        cart: {
          items: newItems,
          total: newTotal,
          itemCount: newItemCount,
        },
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.cart.items.filter(item => item.id !== action.payload);
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        cart: {
          items: newItems,
          total: newTotal,
          itemCount: newItemCount,
        },
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          items: [],
          total: 0,
          itemCount: 0,
        },
      };

    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => state.cart.itemCount;
  const getTotalPrice = () => state.cart.total;

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'SET_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getItemCount,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};