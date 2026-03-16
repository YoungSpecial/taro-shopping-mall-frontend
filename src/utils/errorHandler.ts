import { GlobalErrorHandler } from '../components/templates/ErrorBoundary';

// 初始化全局错误处理器
export const errorHandler = GlobalErrorHandler.getInstance();

// 错误类型定义
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  BUSINESS = 'business',
  UNKNOWN = 'unknown'
}

// 错误上下文接口
export interface ErrorContext {
  type: ErrorType;
  component?: string;
  operation?: string;
  data?: Record<string, any>;
  timestamp: number;
}

// 创建错误上下文
export function createErrorContext(
  type: ErrorType,
  component?: string,
  operation?: string,
  data?: Record<string, any>
): ErrorContext {
  return {
    type,
    component,
    operation,
    data,
    timestamp: Date.now()
  };
}

// 网络错误处理
export function handleNetworkError(error: any, context?: Partial<ErrorContext>): void {
  const errorContext = createErrorContext(
    ErrorType.NETWORK,
    context?.component,
    context?.operation,
    { ...context?.data, originalError: error }
  );

  const errorObj = error instanceof Error ? error : new Error(`网络错误: ${JSON.stringify(error)}`);
  
  errorHandler.reportError(errorObj, errorContext);
  
  // 平台特定的网络错误处理
  if (process.env.TARO_ENV === 'weapp') {
    // 微信小程序网络错误处理
    wx.showToast({
      title: '网络连接失败',
      icon: 'none',
      duration: 2000
    });
  } else {
    // H5网络错误处理
    console.warn('网络错误:', error, errorContext);
  }
}

// 验证错误处理
export function handleValidationError(
  field: string,
  message: string,
  value: any,
  context?: Partial<ErrorContext>
): void {
  const errorContext = createErrorContext(
    ErrorType.VALIDATION,
    context?.component,
    context?.operation,
    { field, message, value, ...context?.data }
  );

  const error = new Error(`验证错误: ${field} - ${message}`);
  
  errorHandler.reportError(error, errorContext);
  
  // 平台特定的验证错误处理
  if (process.env.TARO_ENV === 'weapp') {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  } else {
    console.warn('验证错误:', field, message, value);
  }
}

// 业务错误处理
export function handleBusinessError(
  code: string,
  message: string,
  data?: any,
  context?: Partial<ErrorContext>
): void {
  const errorContext = createErrorContext(
    ErrorType.BUSINESS,
    context?.component,
    context?.operation,
    { code, message, data, ...context?.data }
  );

  const error = new Error(`业务错误: ${code} - ${message}`);
  
  errorHandler.reportError(error, errorContext);
  
  // 业务错误映射
  const errorMessages: Record<string, string> = {
    'OUT_OF_STOCK': '商品库存不足',
    'INVALID_PAYMENT': '支付方式无效',
    'ORDER_FAILED': '订单创建失败',
    'CART_EMPTY': '购物车为空'
  };

  const userMessage = errorMessages[code] || message;
  
  if (process.env.TARO_ENV === 'weapp') {
    wx.showToast({
      title: userMessage,
      icon: 'none',
      duration: 2000
    });
  } else {
    console.warn('业务错误:', code, message, data);
  }
}

// 未知错误处理
export function handleUnknownError(error: any, context?: Partial<ErrorContext>): void {
  const errorContext = createErrorContext(
    ErrorType.UNKNOWN,
    context?.component,
    context?.operation,
    { originalError: error, ...context?.data }
  );

  const errorObj = error instanceof Error ? error : new Error(`未知错误: ${JSON.stringify(error)}`);
  
  errorHandler.reportError(errorObj, errorContext);
  
  // 友好的错误提示
  const userMessage = '系统繁忙，请稍后重试';
  
  if (process.env.TARO_ENV === 'weapp') {
    wx.showToast({
      title: userMessage,
      icon: 'none',
      duration: 2000
    });
  } else {
    console.error('未知错误:', error, errorContext);
  }
}

// 错误监听器示例
export function setupErrorListeners(): void {
  // 添加错误监听器
  errorHandler.addErrorListener((error) => {
    console.log('错误监听器捕获:', error);
    
    // 可以根据错误类型进行不同的处理
    if (error.message.includes('网络')) {
      // 网络错误特殊处理
    } else if (error.message.includes('验证')) {
      // 验证错误特殊处理
    }
  });

  // 添加性能监控错误监听
  errorHandler.addErrorListener((error) => {
    // 发送到性能监控
    if (typeof window !== 'undefined' && window.performance) {
      const entry = {
        name: 'error',
        entryType: 'error',
        startTime: performance.now(),
        duration: 0,
        error
      };
      
      // 可以存储到本地或发送到服务器
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push(entry);
      localStorage.setItem('app_errors', JSON.stringify(errors.slice(-100))); // 保留最近100个错误
    }
  });
}

// 错误工具函数
export const errorUtils = {
  // 检查是否为网络错误
  isNetworkError: (error: any): boolean => {
    if (!error) return false;
    
    if (error instanceof Error) {
      return error.message.includes('网络') || 
             error.message.includes('Network') || 
             error.message.includes('fetch') ||
             error.message.includes('HTTP');
    }
    
    return false;
  },

  // 检查是否为超时错误
  isTimeoutError: (error: any): boolean => {
    if (!error) return false;
    
    if (error instanceof Error) {
      return error.message.includes('超时') || 
             error.message.includes('timeout') || 
             error.message.includes('Timeout');
    }
    
    return false;
  },

  // 获取错误摘要
  getErrorSummary: (error: any): string => {
    if (!error) return '无错误信息';
    
    if (error instanceof Error) {
      return `${error.name}: ${error.message}`;
    }
    
    return String(error);
  },

  // 清理错误信息（移除敏感数据）
  sanitizeError: (error: any): any => {
    if (!error) return error;
    
    const sanitized = { ...error };
    
    // 移除可能的敏感信息
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'credit', 'card'];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }
};

// 默认导出
export default {
  errorHandler,
  ErrorType,
  createErrorContext,
  handleNetworkError,
  handleValidationError,
  handleBusinessError,
  handleUnknownError,
  setupErrorListeners,
  errorUtils
};