import {
  Product,
  ProductFilter,
  SortOption,
  Review,
  ProductListRequest,
  ProductListResponse,
  ProductSearchRequest,
  ProductSearchResponse,
  CartItemRequest,
  CartItemResponse,
  CartResponse,
  UpdateCartItemRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderResponse,
  OrderListResponse,
  ShippingAddressRequest,
  ShippingAddressResponse,
  PaymentMethodResponse,
  ApiResponse
} from '../types';
import { httpClient } from '../utils/httpClient';

// API服务基类接口
export interface IApiService {
  getProducts(filter?: ProductFilter, sortBy?: SortOption, page?: number, pageSize?: number): Promise<ProductListResponse>;
  getProductById(id: string): Promise<Product | null>;
  searchProducts(query: string): Promise<Product[]>;
  getCategories(): Promise<string[]>;
  getProductReviews(productId: string, page?: number, pageSize?: number): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    averageRating: number;
  }>;

  getCart(): Promise<CartResponse>;
  addToCart(item: CartItemRequest): Promise<CartItemResponse>;
  updateCartItem(itemId: string, updates: UpdateCartItemRequest): Promise<CartItemResponse>;
  removeCartItem(itemId: string): Promise<void>;

  createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse>;
  getOrder(orderId: string): Promise<OrderResponse>;
  getOrders(page?: number, pageSize?: number): Promise<OrderListResponse>;

  getShippingAddresses(): Promise<ShippingAddressResponse[]>;
  addShippingAddress(address: ShippingAddressRequest): Promise<ShippingAddressResponse>;
  updateShippingAddress(id: string, updates: Partial<ShippingAddressRequest>): Promise<ShippingAddressResponse>;
  getShippingMethods(): Promise<Array<{ id: string; name: string; cost: number; estimatedDays: number }>>;
  getPaymentMethods(): Promise<PaymentMethodResponse[]>;
}

// 真实API服务实现
export class RealApiService implements IApiService {
  async getProducts(filter?: ProductFilter, sortBy?: SortOption, page = 1, pageSize = 10): Promise<ProductListResponse> {
    const request: ProductListRequest = {
      category: filter?.category,
      minPrice: filter?.minPrice,
      maxPrice: filter?.maxPrice,
      minRating: filter?.minRating,
      search: filter?.search,
      sortBy,
      page,
      pageSize,
    };

    const response = await httpClient.get<ApiResponse<ProductListResponse>>('/products', request);
    return response.data.data;
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await httpClient.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) return [];

    const request: ProductSearchRequest = { q: query };
    const response = await httpClient.get<ApiResponse<ProductSearchResponse>>('/products/search', request);
    return response.data.data.products;
  }

  async getCategories(): Promise<string[]> {
    const response = await httpClient.get<ApiResponse<string[]>>('/categories');
    return response.data.data;
  }

  async getProductReviews(productId: string, page = 1, pageSize = 5): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    averageRating: number;
  }> {
    const response = await httpClient.get<ApiResponse<{
      reviews: Review[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      averageRating: number;
    }>>(`/products/${productId}/reviews`, { page, pageSize });

    return response.data.data;
  }

  async getCart(): Promise<CartResponse> {
    const response = await httpClient.get<ApiResponse<CartResponse>>('/cart');
    return response.data.data;
  }

  async addToCart(item: CartItemRequest): Promise<CartItemResponse> {
    const response = await httpClient.post<ApiResponse<CartItemResponse>>('/cart/items', item);
    return response.data.data;
  }

  async updateCartItem(itemId: string, updates: UpdateCartItemRequest): Promise<CartItemResponse> {
    const response = await httpClient.put<ApiResponse<CartItemResponse>>(`/cart/items/${itemId}`, updates);
    return response.data.data;
  }

  async removeCartItem(itemId: string): Promise<void> {
    await httpClient.delete<ApiResponse<void>>(`/cart/items/${itemId}`);
  }

  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await httpClient.post<ApiResponse<CreateOrderResponse>>('/orders', orderData);
    return response.data.data;
  }

  async getOrder(orderId: string): Promise<OrderResponse> {
    const response = await httpClient.get<ApiResponse<OrderResponse>>(`/orders/${orderId}`);
    return response.data.data;
  }

  async getOrders(page = 1, pageSize = 10): Promise<OrderListResponse> {
    const response = await httpClient.get<ApiResponse<OrderListResponse>>('/orders', { page, pageSize });
    return response.data.data;
  }

  async getShippingAddresses(): Promise<ShippingAddressResponse[]> {
    const response = await httpClient.get<ApiResponse<ShippingAddressResponse[]>>('/shipping-addresses');
    return response.data.data;
  }

  async addShippingAddress(address: ShippingAddressRequest): Promise<ShippingAddressResponse> {
    const response = await httpClient.post<ApiResponse<ShippingAddressResponse>>('/shipping-addresses', address);
    return response.data.data;
  }

  async updateShippingAddress(id: string, updates: Partial<ShippingAddressRequest>): Promise<ShippingAddressResponse> {
    const response = await httpClient.put<ApiResponse<ShippingAddressResponse>>(`/shipping-addresses/${id}`, updates);
    return response.data.data;
  }

  async getShippingMethods(): Promise<Array<{ id: string; name: string; cost: number; estimatedDays: number }>> {
    const response = await httpClient.get<ApiResponse<Array<{ id: string; name: string; cost: number; estimatedDays: number }>>>('/shipping-methods');
    return response.data.data;
  }

  async getPaymentMethods(): Promise<PaymentMethodResponse[]> {
    const response = await httpClient.get<ApiResponse<PaymentMethodResponse[]>>('/payment-methods');
    return response.data.data;
  }
}

// Mock API服务实现
export class MockApiService implements IApiService {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getProducts(filter?: ProductFilter, sortBy?: SortOption, page = 1, pageSize = 10): Promise<ProductListResponse> {
    await this.delay(300);
    // 使用参数避免LSP警告
    const _ = { filter, sortBy };
    return {
      products: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    await this.delay(200);
    // 使用参数避免LSP警告
    const _ = id;
    return null;
  }

  async searchProducts(query: string): Promise<Product[]> {
    await this.delay(200);
    // 使用参数避免LSP警告
    const _ = query;
    return [];
  }

  async getProductReviews(productId: string, page = 1, pageSize = 5): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    averageRating: number;
  }> {
    await this.delay(300);
    // 使用参数避免LSP警告
    const _ = productId;
    return {
      reviews: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      averageRating: 0,
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    await this.delay(200);
    return null;
  }

  async searchProducts(query: string): Promise<Product[]> {
    await this.delay(200);
    return [];
  }

  async getCategories(): Promise<string[]> {
    await this.delay(100);
    return [];
  }

  async getProductReviews(productId: string, page = 1, pageSize = 5): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    averageRating: number;
  }> {
    await this.delay(300);
    return {
      reviews: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      averageRating: 0,
    };
  }

  async getCart(): Promise<CartResponse> {
    await this.delay(150);
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      shippingCost: 0,
      total: 0,
    };
  }

  async addToCart(item: CartItemRequest): Promise<CartItemResponse> {
    await this.delay(200);
    return {
      id: Date.now().toString(),
      productId: item.productId,
      variantId: item.variantId,
      name: 'Mock Product',
      price: 0,
      quantity: item.quantity,
      image: '',
      stock: 0,
    };
  }

  async updateCartItem(itemId: string, updates: UpdateCartItemRequest): Promise<CartItemResponse> {
    await this.delay(200);
    return {
      id: itemId,
      productId: 'mock',
      name: 'Mock Product',
      price: 0,
      quantity: updates.quantity,
      image: '',
      stock: 0,
    };
  }

  async removeCartItem(itemId: string): Promise<void> {
    await this.delay(200);
  }

  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    await this.delay(500);
    return {
      orderId: `ORD${Date.now()}`,
      orderNumber: `ORDER-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      status: 'pending',
      total: 0,
    };
  }

  async getOrder(orderId: string): Promise<OrderResponse> {
    await this.delay(200);
    throw new Error('Mock order not found');
  }

  async getOrders(page = 1, pageSize = 10): Promise<OrderListResponse> {
    await this.delay(200);
    return {
      orders: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  async getShippingAddresses(): Promise<ShippingAddressResponse[]> {
    await this.delay(150);
    return [];
  }

  async addShippingAddress(address: ShippingAddressRequest): Promise<ShippingAddressResponse> {
    await this.delay(200);
    return {
      id: Date.now().toString(),
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      isDefault: address.isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateShippingAddress(id: string, updates: Partial<ShippingAddressRequest>): Promise<ShippingAddressResponse> {
    await this.delay(200);
    return {
      id,
      name: updates.name || '',
      phone: updates.phone || '',
      province: updates.province || '',
      city: updates.city || '',
      district: updates.district || '',
      detail: updates.detail || '',
      isDefault: updates.isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getShippingMethods(): Promise<Array<{ id: string; name: string; cost: number; estimatedDays: number }>> {
    await this.delay(100);
    return [];
  }

  async getPaymentMethods(): Promise<PaymentMethodResponse[]> {
    await this.delay(100);
    return [];
  }
}
