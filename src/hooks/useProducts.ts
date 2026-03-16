import { useState, useEffect, useCallback } from 'react';
import {Category, Product, ProductFilter, SortOption} from '../types';
import { ApiService } from '../services/api';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  categories: Category[];
  filter: ProductFilter;
  sortBy: SortOption;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  setFilter: (filter: ProductFilter) => void;
  setSortBy: (sortBy: SortOption) => void;
  setPage: (page: number) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  resetFilters: () => void;
  searchProducts: (query: string) => Promise<Product[]>;
}

export const useProducts = (initialFilter?: ProductFilter, initialSort?: SortOption): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilterState] = useState<ProductFilter>(initialFilter || {});
  const [sortBy, setSortByState] = useState<SortOption>(initialSort || 'newest');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  const fetchProducts = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      }
      setError(null);
      const response = await ApiService.getProducts(filter, sortBy, page, pagination.pageSize);

      if (append) {
        setProducts(prev => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }

      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        totalPages: response.totalPages,
        hasMore: response.page < response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, sortBy, pagination.pageSize]);

  const fetchCategories = useCallback(async () => {
    console.log('Fetching categories...')
    try {
      const data = await ApiService.getCategories();
      console.log('Categories:', data)
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1, false);
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const setFilter = useCallback((newFilter: ProductFilter) => {
    setFilterState(newFilter);
  }, []);

  const setSortBy = useCallback((newSortBy: SortOption) => {
    setSortByState(newSortBy);
  }, []);

  const setPage = useCallback((page: number) => {
    fetchProducts(page, false);
  }, [fetchProducts]);

  const loadMore = useCallback(async () => {
    if (pagination.hasMore && !loading) {
      await fetchProducts(pagination.page + 1, true);
    }
  }, [fetchProducts, pagination.hasMore, pagination.page, loading]);

  const refresh = useCallback(async () => {
    await fetchProducts(1, false);
  }, [fetchProducts]);

  const resetFilters = useCallback(() => {
    setFilterState({});
    setSortByState('newest');
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    try {
      return await ApiService.searchProducts(query);
    } catch (err) {
      console.error('Error searching products:', err);
      return [];
    }
  }, []);

  return {
    products,
    loading,
    error,
    categories,
    filter,
    sortBy,
    pagination,
    setFilter,
    setSortBy,
    setPage,
    loadMore,
    refresh,
    resetFilters,
    searchProducts,
  };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const refresh = useCallback(async () => {
    await fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refresh,
  };
};
