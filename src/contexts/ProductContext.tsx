import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, ProductFilter, SortOption } from '../types';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  filter: ProductFilter;
  sortBy: SortOption;
}

type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTER'; payload: Partial<ProductFilter> }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'CLEAR_FILTER' };

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  categories: [],
  loading: false,
  error: null,
  filter: {},
  sortBy: 'newest',
};

const filterAndSortProducts = (
  products: Product[],
  filter: ProductFilter,
  sortBy: SortOption
): Product[] => {
  let filtered = [...products];

  if (filter.category) {
    filtered = filtered.filter(product => product.category === filter.category);
  }

  if (filter.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= filter.minPrice!);
  }

  if (filter.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= filter.maxPrice!);
  }

  if (filter.minRating !== undefined) {
    filtered = filtered.filter(product => product.rating >= filter.minRating!);
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(
      product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
    );
  }

  switch (sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case 'popular':
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  return filtered;
};

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'SET_PRODUCTS': {
      const filteredProducts = filterAndSortProducts(
        action.payload,
        state.filter,
        state.sortBy
      );
      return {
        ...state,
        products: action.payload,
        filteredProducts,
        loading: false,
      };
    }

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'SET_FILTER': {
      const newFilter = { ...state.filter, ...action.payload };
      const filteredProducts = filterAndSortProducts(state.products, newFilter, state.sortBy);
      return {
        ...state,
        filter: newFilter,
        filteredProducts,
      };
    }

    case 'SET_SORT': {
      const filteredProducts = filterAndSortProducts(state.products, state.filter, action.payload);
      return {
        ...state,
        sortBy: action.payload,
        filteredProducts,
      };
    }

    case 'CLEAR_FILTER': {
      const filteredProducts = filterAndSortProducts(state.products, {}, state.sortBy);
      return {
        ...state,
        filter: {},
        filteredProducts,
      };
    }

    default:
      return state;
  }
};

interface ProductContextType {
  state: ProductState;
  setProducts: (products: Product[]) => void;
  setCategories: (categories: string[]) => void;
  setFilter: (filter: Partial<ProductFilter>) => void;
  setSort: (sortBy: SortOption) => void;
  clearFilter: () => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const setProducts = (products: Product[]) => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  };

  const setCategories = (categories: string[]) => {
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  };

  const setFilter = (filter: Partial<ProductFilter>) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSort = (sortBy: SortOption) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };

  const clearFilter = () => {
    dispatch({ type: 'CLEAR_FILTER' });
  };

  const getProductById = (id: string) => {
    return state.products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string) => {
    return state.products.filter(product => product.category === category);
  };

  return (
    <ProductContext.Provider
      value={{
        state,
        setProducts,
        setCategories,
        setFilter,
        setSort,
        clearFilter,
        getProductById,
        getProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};