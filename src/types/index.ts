// 环境变量类型
declare global {
  const API_BASE_URL: string;
  const USE_MOCK_API: boolean;
}

export interface Category {
  id: number;
  name: string;
  count: number;
}

// 产品相关类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  attributes?: Record<string, string>;
  variants?: ProductVariant[];
  imageUrl?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // 如 { color: '红色', size: 'M' }
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  verifiedPurchase: boolean;
  images?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  attributes?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  productName: string;
  price: number;
  quantity: number;
  productImage: string;
}

export interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
}

// 筛选和排序类型
export interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}

export type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';

// ==================== API 相关类型 ====================

// API 统一响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 产品API相关类型
export interface ProductListRequest {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sortBy?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface ProductListResponse {
  content: Product[];
  totalPages: number;
  page: number;
  pageSize: number;
  totalElements: number;
}

export interface ProductSearchRequest {
  q: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 购物车API相关类型
export interface CartItemRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CartItemResponse {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  attributes?: Record<string, string>;
}

export interface CartResponse {
  items: CartItemResponse[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// 订单API相关类型
export interface CreateOrderRequest {
  cartItemIds: string[];
  shippingAddressId: string;
  shippingMethod: string;
  paymentMethod: string;
  notes?: string;
}

export interface CreateOrderResponse {
  id: number,
  orderId: string;
  orderNumber: string;
  status?: 'PAID' | 'CANCELLED';
  estimatedDelivery?: string;
  totalAmount: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  shippingFee: number;
  paymentMethod: string;
  status: 'PAID' | 'CANCELLED';
  createdAt: string;
  estimatedDelivery?: string;
}

export interface OrderListResponse {
  content: OrderResponse[];
  page: number;
  size: number;
  totalElements: number;
}

// 用户数据API相关类型
export interface ShippingAddressRequest {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault?: boolean;
}

export interface ShippingAddressResponse {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodResponse {
  id: string;
  name: string;
  type: 'alipay' | 'wechat' | 'bank_card' | 'balance';
  icon?: string;
  isDefault: boolean;
}

// 错误响应类型
export interface ErrorResponse {
  code: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: number;
}

// API 配置类型
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  useMock: boolean;
}

export interface OrderCreateRequest {
  address: ShippingAddress;
  paymentMethod: string;
  items: OrderItem[];
}
export interface OrderCreateResponse {
  orderNumber: string;
}
