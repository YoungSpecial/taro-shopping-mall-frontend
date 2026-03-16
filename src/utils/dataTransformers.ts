import { 
  Product, 
  ProductListResponse,
  CartItemResponse,
  CartResponse,
  OrderResponse,
  ShippingAddress,
  ShippingAddressResponse,
  PaymentMethodResponse,
  ApiResponse
} from '../types';

// 产品数据转换器
export class ProductTransformer {
  // 转换产品列表响应
  static transformProductListResponse(apiResponse: ApiResponse<ProductListResponse>): ProductListResponse {
    return {
      products: apiResponse.data.products.map(product => this.transformProduct(product)),
      total: apiResponse.data.total,
      page: apiResponse.data.page,
      pageSize: apiResponse.data.pageSize,
      totalPages: apiResponse.data.totalPages,
    };
  }

  // 转换单个产品
  static transformProduct(product: any): Product {
    // 这里可以根据后端API的实际字段名进行转换
    // 例如：如果后端使用不同的字段名，可以在这里映射
    return {
      id: product.id?.toString() || '',
      name: product.name || product.title || '',
      description: product.description || product.desc || '',
      price: Number(product.price) || 0,
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      images: Array.isArray(product.images) ? product.images : 
              product.image ? [product.image] : 
              product.pictures ? product.pictures : [],
      category: product.category || product.categoryId || 'uncategorized',
      rating: Number(product.rating) || Number(product.averageRating) || 0,
      reviewCount: Number(product.reviewCount) || Number(product.reviewsCount) || 0,
      stock: Number(product.stock) || Number(product.inventory) || 0,
      sku: product.sku || product.code || '',
      attributes: product.attributes || product.specifications || {},
      variants: Array.isArray(product.variants) ? product.variants.map((variant: any) => ({
        id: variant.id?.toString() || '',
        name: variant.name || variant.sku || '',
        price: Number(variant.price) || Number(product.price) || 0,
        stock: Number(variant.stock) || Number(variant.inventory) || 0,
        attributes: variant.attributes || variant.specifications || {},
      })) : undefined,
    };
  }

  // 转换搜索产品响应
  static transformSearchResponse(apiResponse: ApiResponse<{ products: any[] }>): Product[] {
    return apiResponse.data.products.map(product => this.transformProduct(product));
  }
}

// 购物车数据转换器
export class CartTransformer {
  // 转换购物车响应
  static transformCartResponse(apiResponse: ApiResponse<CartResponse>): CartResponse {
    return {
      items: apiResponse.data.items.map(item => this.transformCartItem(item)),
      totalItems: apiResponse.data.totalItems || apiResponse.data.items.length,
      subtotal: Number(apiResponse.data.subtotal) || 0,
      shippingCost: Number(apiResponse.data.shippingCost) || 0,
      total: Number(apiResponse.data.total) || 0,
    };
  }

  // 转换购物车商品项
  static transformCartItem(item: any): CartItemResponse {
    return {
      id: item.id?.toString() || '',
      productId: item.productId?.toString() || '',
      variantId: item.variantId?.toString() || undefined,
      name: item.name || item.productName || '',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || item.productImage || '',
      stock: Number(item.stock) || Number(item.inventory) || 0,
      attributes: item.attributes || item.specifications || {},
    };
  }
}

// 订单数据转换器
export class OrderTransformer {
  // 转换订单响应
  static transformOrderResponse(apiResponse: ApiResponse<any>): OrderResponse {
    const data = apiResponse.data;
    return {
      id: data.id?.toString() || '',
      orderNumber: data.orderNumber || data.orderNo || '',
      items: Array.isArray(data.items) ? data.items : [],
      total: Number(data.total) || 0,
      shippingAddress: this.transformShippingAddress(data.shippingAddress),
      shippingMethod: data.shippingMethod || '',
      shippingCost: Number(data.shippingCost) || 0,
      paymentMethod: data.paymentMethod || '',
      status: this.transformOrderStatus(data.status),
      createdAt: data.createdAt || data.createTime || new Date().toISOString(),
      estimatedDelivery: data.estimatedDelivery || data.deliveryTime,
    };
  }

  // 转换订单状态
  private static transformOrderStatus(status: any): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
    const statusMap: Record<string, 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'> = {
      'pending': 'pending',
      'processing': 'processing',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'waiting_payment': 'pending',
      'paid': 'processing',
      'shipping': 'shipped',
      'completed': 'delivered',
      'refunded': 'cancelled',
    };
    
    const statusStr = String(status).toLowerCase();
    return statusMap[statusStr] || 'pending';
  }

  // 转换收货地址
  private static transformShippingAddress(address: any): ShippingAddress {
    return {
      id: address.id?.toString() || '',
      name: address.name || address.recipient || '',
      phone: address.phone || address.mobile || '',
      province: address.province || address.state || '',
      city: address.city || '',
      district: address.district || address.area || '',
      address: address.detail || address.address || '',
      postalCode: address.postalCode || address.zipCode || '',
      isDefault: Boolean(address.isDefault),
    };
  }
}

// 用户数据转换器
export class UserDataTransformer {
  // 转换收货地址响应
  static transformShippingAddressResponse(apiResponse: ApiResponse<ShippingAddressResponse[]>): ShippingAddressResponse[] {
    return apiResponse.data.map(address => ({
      id: address.id?.toString() || '',
      name: address.name || '',
      phone: address.phone || '',
      province: address.province || '',
      city: address.city || '',
      district: address.district || '',
      detail: address.detail || '',
      isDefault: Boolean(address.isDefault),
      createdAt: address.createdAt || new Date().toISOString(),
      updatedAt: address.updatedAt || new Date().toISOString(),
    }));
  }

  // 转换支付方式响应
  static transformPaymentMethodsResponse(apiResponse: ApiResponse<PaymentMethodResponse[]>): PaymentMethodResponse[] {
    return apiResponse.data.map(method => ({
      id: method.id?.toString() || '',
      name: method.name || '',
      type: this.transformPaymentType(method.type),
      icon: method.icon || '',
      isDefault: Boolean(method.isDefault),
    }));
  }

  // 转换支付类型
  private static transformPaymentType(type: any): 'alipay' | 'wechat' | 'bank_card' | 'balance' {
    const typeMap: Record<string, 'alipay' | 'wechat' | 'bank_card' | 'balance'> = {
      'alipay': 'alipay',
      'wechat': 'wechat',
      'bank_card': 'bank_card',
      'balance': 'balance',
      'alipay_pay': 'alipay',
      'wechat_pay': 'wechat',
      'credit_card': 'bank_card',
      'debit_card': 'bank_card',
      'wallet': 'balance',
    };
    
    const typeStr = String(type).toLowerCase();
    return typeMap[typeStr] || 'alipay';
  }
}

// 统一数据转换器
export const DataTransformer = {
  products: ProductTransformer,
  cart: CartTransformer,
  orders: OrderTransformer,
  userData: UserDataTransformer,
};