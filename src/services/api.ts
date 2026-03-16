import {
  ApiResponse,
  Category,
  CreateOrderResponse,
  OrderCreateRequest,
  OrderListResponse, OrderResponse,
  Product,
  ProductFilter,
  ProductListResponse,
  Review,
  ShippingAddress,
  SortOption
} from '../types';
import {
  mockCategories,
  mockPaymentMethods,
  mockProducts,
  mockReviews,
  mockShippingAddresses,
  mockShippingMethods
} from './mockData';
import {httpClient} from '../utils/httpClient';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 检查是否使用mock API
const shouldUseMockApi = typeof USE_MOCK_API !== 'undefined' ? USE_MOCK_API : true;

// 真实API实现
class RealApiServiceImpl {
  static async getProducts(filter?: ProductFilter, sortBy?: SortOption, page = 1, pageSize = 10): Promise<{
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const params: any = {
      page,
      pageSize,
    };

    if (filter?.categoryId && filter.categoryId !== -1) {
      params.categoryId = filter.categoryId;
    }

    if (filter?.minPrice !== undefined) {
      params.minPrice = filter.minPrice;
    }

    if (filter?.maxPrice !== undefined) {
      params.maxPrice = filter.maxPrice;
    }

    if (filter?.minRating !== undefined) {
      params.minRating = filter.minRating;
    }

    if (filter?.search) {
      params.search = filter.search;
    }

    if (sortBy) {
      params.sortBy = sortBy;
    }

    try {
      const response = await httpClient.post<ProductListResponse>('/products', params);
      console.log('Fetched products from real API:', response);
      return {
        products: response.data.content,
        total: response.data.totalElements,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error('Failed to fetch products from real API:', error);
      // 回退到mock数据
      return {
        products: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await httpClient.get<Product>(`/products/${id}`);
      console.log(`Fetched product ${id} from real API:`, response);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id} from real API:`, error);
      // 回退到mock数据
      return MockApiServiceImpl.getProductById(id);
    }
  }

  static async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await httpClient.get<ApiResponse<{ products: Product[] }>>('/products/search', { q: query });
      return response.data.data.products;
    } catch (error) {
      console.error('Failed to search products from real API:', error);
      // 回退到mock数据
      return MockApiServiceImpl.searchProducts(query);
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const response = await httpClient.get<Category[]>('/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories from real API:', error);
      return [];
    }
  }

  static async getShippingAddresses(): Promise<ShippingAddress[]> {
    try {
      const response = await httpClient.get<ApiResponse<ShippingAddress[]>>('/shipping-addresses');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch shipping addresses from real API:', error);
      return [];
    }
  }

  static async addShippingAddress(address: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress | null> {
    try {
      const response = await httpClient.post<ApiResponse<ShippingAddress>>('/shipping-addresses', address);
      return response.data.data;
    } catch (error) {
      console.error('Failed to add shipping address to real API:', error);
      return null;
    }
  }

  static async updateShippingAddress(id: string, updates: Partial<ShippingAddress>): Promise<ShippingAddress | null> {
    try {
      const response = await httpClient.put<ApiResponse<ShippingAddress>>(`/shipping-addresses/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update shipping address in real API:', error);
      return null;
    }
  }

  static async getShippingMethods() {
    try {
      const response = await httpClient.get<ApiResponse<any>>('/shipping-methods');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch shipping methods from real API:', error);
      return [];
    }
  }

  static async getPaymentMethods() {
    try {
      const response = await httpClient.get<ApiResponse<any>>('/payment-methods');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch payment methods from real API:', error);
      return [];
    }
  }

  static async createOrder(orderData: OrderCreateRequest): Promise<CreateOrderResponse> {
    try {
      const response = await httpClient.post<CreateOrderResponse>('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create order in real API:', error);
      return {
        id: 0,
        orderId: '',
        orderNumber: '',
        status: 'CANCELLED',
        estimatedDelivery: undefined,
        totalAmount: 0.0,
      }
    }
  }

  static async getOrders(page = 1, pageSize = 10): Promise<OrderListResponse> {
    try {
      const params: any = {
        page,
        pageSize,
      };
      const response = await httpClient.post<OrderListResponse>('/orders/list', params);
      return response.data;
    } catch (error) {
      console.error('Failed to get orders in real API:', error);
      return {
        content: [],
        page: 1,
        size: 10,
        totalElements: 0
      };
    }
  }

  static async getOrder(orderId): Promise<OrderResponse> {
    try {
      const response = await httpClient.get<OrderResponse>(`/orders/${orderId}`);
      console.log("response",response)
      return response.data;
    } catch (error) {
      console.error('Failed to get orders in real API:', error);
      // 返回一个mock订单数据
      return {
        id: parseInt(orderId) || 1,
        orderNumber: `ORDER-${orderId || '001'}`,
        items: [
          { productId: '1', productName: '无线蓝牙耳机', price: 299, quantity: 1, image: 'https://via.placeholder.com/80x80' },
          { productId: '2', productName: '手机保护壳', price: 49, quantity: 2, image: 'https://via.placeholder.com/80x80' }
        ],
        totalAmount: 397,
        shippingAddress: {
          id: '1',
          name: '张三',
          phone: '13800138000',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          address: '建国路88号SOHO现代城A座',
          postalCode: '100022',
          isDefault: true
        },
        shippingMethod: 'standard',
        shippingCost: 8,
        paymentMethod: 'simulated',
        status: 'PAID',
        createdAt: new Date().toISOString()
      };
    }
  }

  static async getProductReviews(productId: string, page = 1, pageSize = 5): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    averageRating: number;
  }> {
    try {
      const response = await httpClient.get<ApiResponse<{
        reviews: Review[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        averageRating: number;
      }>>(`/products/${productId}/reviews`, { page, pageSize });

      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch product reviews from real API:', error);
      return {
        reviews: [],
        total: 0,
        page: 1,
        pageSize: 5,
        totalPages: 1,
        averageRating: 0,
      };
    }
  }
}

// Mock API实现（现有逻辑）
class MockApiServiceImpl {
  static async getProducts(filter?: ProductFilter, sortBy?: SortOption, page = 1, pageSize = 10): Promise<{
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    await delay(300);

    let products = [...mockProducts];

    if (filter) {
      if (filter?.categoryId && filter.categoryId !== -1) {
        products = products.filter(p => p.category === filter.categoryId!.toString());
      }

      if (filter.minPrice !== undefined) {
        products = products.filter(p => p.price >= filter.minPrice!);
      }

      if (filter.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filter.maxPrice!);
      }

      if (filter.minRating !== undefined) {
        products = products.filter(p => p.rating >= filter.minRating!);
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        products = products.filter(
          p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
      }
    }

    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
        case 'popular':
          products.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: products.length,
      page,
      pageSize,
      totalPages: Math.ceil(products.length / pageSize)
    };
  }

  static async getProductById(id: string): Promise<Product | null> {
    await delay(200);
    const product = mockProducts.find(p => p.id === id);
    return product || null;
  }

  static async searchProducts(query: string): Promise<Product[]> {
    await delay(200);

    if (!query.trim()) {
      return [];
    }

    const queryLower = query.toLowerCase();
    return mockProducts.filter(
      product =>
        product.name.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower) ||
        product.category.toLowerCase().includes(queryLower)
    );
  }

  // 其他Mock方法保持现有逻辑...
}

// 主ApiService类 - 支持mock/真实API切换
export class ApiService {
  static async getProducts(filter?: ProductFilter, sortBy?: SortOption, page = 1, pageSize = 10): Promise<{
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    console.log('Fetching products with filter:', filter, 'sort by:', sortBy, 'page:', page, 'page size:', pageSize)
    if (shouldUseMockApi) {
      return MockApiServiceImpl.getProducts(filter, sortBy, page, pageSize);
    } else {
      return RealApiServiceImpl.getProducts(filter, sortBy, page, pageSize);
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    if (shouldUseMockApi) {
      return MockApiServiceImpl.getProductById(id);
    } else {
      return RealApiServiceImpl.getProductById(id);
    }
  }

  static async getCategories() {
    await delay(100);
    if (shouldUseMockApi) {
      return mockCategories;
    } else {
      return RealApiServiceImpl.getCategories();
    }
  }

  static async getShippingAddresses(): Promise<ShippingAddress[]> {
    await delay(150);
    return mockShippingAddresses;
  }

  static async addShippingAddress(address: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress> {
    await delay(200);
    const newAddress: ShippingAddress = {
      ...address,
      id: Date.now().toString(),
    };
    return newAddress;
  }

  static async updateShippingAddress(id: string, updates: Partial<ShippingAddress>): Promise<ShippingAddress> {
    await delay(200);
    const address = mockShippingAddresses.find(a => a.id === id);
    if (!address) {
      throw new Error('Address not found');
    }
    return { ...address, ...updates };
  }

  static async getShippingMethods() {
    await delay(100);
    return mockShippingMethods;
  }

  static async getPaymentMethods() {
    await delay(100);
    return mockPaymentMethods;
  }

  // @ts-ignore
  static async createOrder(orderData: OrderCreateRequest): Promise<CreateOrderResponse> {
    if (shouldUseMockApi) {
      // Mock implementation
      await delay(500);
      const orderId = `ORD${Date.now()}`;
      const orderNumber = `ORDER-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      console.log('Order created:', { orderId, orderNumber, orderData });
      
      return {
        id: parseInt(orderId.replace('ORD', '')) || 1,
        orderId,
        orderNumber,
        status: 'PAID',
        totalAmount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    } else {
      return RealApiServiceImpl.createOrder(orderData);
    }
  }

  static async getOrders(page = 1, pageSize = 10): Promise<OrderListResponse> {
    if (shouldUseMockApi) {
      // Mock implementation
      await delay(300);
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORDER-20250315-001',
          items: [
            { productId: '1', productName: '无线蓝牙耳机', price: 299, quantity: 1, image: 'https://via.placeholder.com/80x80' },
            { productId: '2', productName: '手机保护壳', price: 49, quantity: 2, image: 'https://via.placeholder.com/80x80' }
          ],
          totalAmount: 397,
          shippingAddress: {
            id: '1',
            name: '张三',
            phone: '13800138000',
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            address: '建国路88号SOHO现代城A座',
            postalCode: '100022',
            isDefault: true
          },
          shippingMethod: 'standard',
          shippingCost: 8,
          paymentMethod: 'simulated',
          status: 'PAID' as 'PAID',
          createdAt: '2025-03-15T14:30:00Z'
        },
        {
          id: 2,
          orderNumber: 'ORDER-20250314-002',
          items: [
            { productId: '3', productName: '智能手表', price: 899, quantity: 1, image: 'https://via.placeholder.com/80x80' }
          ],
          totalAmount: 899,
          shippingAddress: {
            id: '2',
            name: '李四',
            phone: '13900139000',
            province: '上海市',
            city: '上海市',
            district: '浦东新区',
            address: '陆家嘴环路100号',
            postalCode: '200120',
            isDefault: false
          },
          shippingMethod: 'express',
          shippingCost: 15,
          paymentMethod: 'simulated',
          status: 'PAID' as 'PAID',
          createdAt: '2025-03-14T10:15:00Z'
        },
        {
          id: 3,
          orderNumber: 'ORDER-20250312-003',
          items: [
            { productId: '4', productName: '笔记本电脑', price: 5999, quantity: 1, image: 'https://via.placeholder.com/80x80' },
            { productId: '5', productName: '鼠标', price: 89, quantity: 1, image: 'https://via.placeholder.com/80x80' }
          ],
          totalAmount: 6088,
          shippingAddress: {
            id: '1',
            name: '张三',
            phone: '13800138000',
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            address: '建国路88号SOHO现代城A座',
            postalCode: '100022',
            isDefault: true
          },
          shippingMethod: 'free',
          shippingCost: 0,
          paymentMethod: 'simulated',
          status: 'PAID' as 'PAID',
          createdAt: '2025-03-12T16:45:00Z'
        }
      ];
      
      return {
        content: mockOrders,
        page,
        size: pageSize,
        totalElements: mockOrders.length
      };
    } else {
      return RealApiServiceImpl.getOrders(page, pageSize);
    }
  }

  static async getOrder(orderId): Promise<OrderResponse> {
    return RealApiServiceImpl.getOrder(orderId);
  }

  static async searchProducts(query: string): Promise<Product[]> {
    await delay(200);

    if (!query.trim()) {
      return [];
    }

    const queryLower = query.toLowerCase();
    return mockProducts.filter(
      product =>
        product.name.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower) ||
        product.category.toLowerCase().includes(queryLower)
    );
  }

  static async getProductReviews(productId: string, page = 1, pageSize = 5): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    averageRating: number;
  }> {
    await delay(300);

    const productReviews = mockReviews.filter(review => review.productId === productId);
    const total = productReviews.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedReviews = productReviews.slice(startIndex, endIndex);

    // 计算平均评分
    const averageRating = productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
      : 0;

    return {
      reviews: paginatedReviews,
      total,
      page,
      pageSize,
      totalPages,
      averageRating
    };
  }
}
