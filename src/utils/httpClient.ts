import Taro from '@tarojs/taro';
import { ErrorType, errorHandler } from './errorHandler';

// HTTP 方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// HTTP 请求配置
export interface HttpRequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  timeout?: number;
  showLoading?: boolean;
  loadingText?: string;
  retryCount?: number;
  retryDelay?: number;
}

// HTTP 响应
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpRequestConfig;
}

// HTTP 错误
export class HttpError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any,
    public config?: HttpRequestConfig
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// 网络错误
export class NetworkError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'NetworkError';
  }
}

// HTTP 客户端类
export class HttpClient {
  private baseURL: string;
  private defaultConfig: HttpRequestConfig;
  private requestInterceptor?: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>;
  private responseInterceptor?: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>;
  private errorInterceptor?: (error: HttpError | NetworkError) => void;

  constructor(baseURL?: string, defaultConfig: HttpRequestConfig = {}) {
    this.baseURL = baseURL || API_BASE_URL;
    this.defaultConfig = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30秒
      showLoading: false,
      retryCount: 0,
      retryDelay: 1000,
      ...defaultConfig,
    };
  }

  // 设置请求拦截器
  setRequestInterceptor(interceptor: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>) {
    this.requestInterceptor = interceptor;
  }

  // 设置响应拦截器
  setResponseInterceptor(interceptor: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>) {
    this.responseInterceptor = interceptor;
  }

  // 设置错误拦截器
  setErrorInterceptor(interceptor: (error: HttpError | NetworkError) => void) {
    this.errorInterceptor = interceptor;
  }

  // 构建完整URL
  private buildFullUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  }

  // 构建查询参数
  private buildQueryParams(params?: Record<string, any>): string {
    if (!params) return '';
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, String(item)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // 显示加载指示器
  private showLoadingIndicator(text?: string) {
    Taro.showLoading({
      title: text || '加载中...',
      mask: true,
    });
  }

  // 隐藏加载指示器
  private hideLoadingIndicator() {
    Taro.hideLoading();
  }

  // 执行HTTP请求
  async request<T = any>(url: string, config: HttpRequestConfig = {}): Promise<HttpResponse<T>> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    let finalConfig = mergedConfig;

    // 应用请求拦截器
    if (this.requestInterceptor) {
      finalConfig = await this.requestInterceptor(finalConfig);
    }

    const fullUrl = this.buildFullUrl(url);
    const queryParams = this.buildQueryParams(finalConfig.params);
    const requestUrl = `${fullUrl}${queryParams}`;

    // 显示加载指示器
    let loadingShown = false;
    if (finalConfig.showLoading) {
      this.showLoadingIndicator(finalConfig.loadingText);
      loadingShown = true;
    }

    try {
      // 执行Taro.request
      const response = await Taro.request({
        url: requestUrl,
        method: finalConfig.method,
        header: finalConfig.headers,
        data: finalConfig.data,
        timeout: finalConfig.timeout,
      });

      // 隐藏加载指示器
      if (loadingShown) {
        this.hideLoadingIndicator();
      }

      // 检查HTTP状态码
      if (response.statusCode >= 200 && response.statusCode < 300) {
        const httpResponse: HttpResponse<T> = {
          data: response.data,
          status: response.statusCode,
          statusText: 'OK',
          headers: response.header || {},
          config: finalConfig,
        };

        // 应用响应拦截器
        if (this.responseInterceptor) {
          return await this.responseInterceptor(httpResponse);
        }

        return httpResponse;
      } else {
        // HTTP错误
        const error = new HttpError(
          `HTTP Error ${response.statusCode}: ${response.errMsg || 'Unknown error'}`,
          response.statusCode,
          response.data,
          finalConfig
        );

        // 应用错误拦截器
        if (this.errorInterceptor) {
          this.errorInterceptor(error);
        }

        // 记录错误
        errorHandler.reportError(error, {
          type: ErrorType.BUSINESS,
          component: 'HttpClient',
          operation: 'request',
          data: {
            url: requestUrl,
            status: response.statusCode,
            config: finalConfig,
          },
          timestamp: Date.now(),
        });

        throw error;
      }
    } catch (error: any) {
      // 隐藏加载指示器
      if (loadingShown) {
        this.hideLoadingIndicator();
      }

      let httpError: HttpError | NetworkError;

      if (error instanceof HttpError) {
        httpError = error;
      } else {
        // 网络错误
        httpError = new NetworkError(
          `Network Error: ${error.errMsg || error.message || 'Unknown network error'}`,
          error
        );
      }

      // 应用错误拦截器
      if (this.errorInterceptor) {
        this.errorInterceptor(httpError);
      }

      // 记录错误
      errorHandler.reportError(httpError, {
        type: ErrorType.NETWORK,
        component: 'HttpClient',
        operation: 'request',
        data: {
          url: requestUrl,
          config: finalConfig,
          originalError: error,
        },
        timestamp: Date.now(),
      });

      // 重试逻辑
      if (finalConfig.retryCount && finalConfig.retryCount > 0) {
        return this.retryRequest<T>(url, finalConfig, finalConfig.retryCount, finalConfig.retryDelay || 1000);
      }

      throw httpError;
    }
  }

  // 重试请求
  private async retryRequest<T>(
    url: string,
    config: HttpRequestConfig,
    retryCount: number,
    retryDelay: number
  ): Promise<HttpResponse<T>> {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        console.log(`Retrying request (attempt ${attempt}/${retryCount})...`);
        return await this.request<T>(url, config);
      } catch (error) {
        if (attempt === retryCount) {
          throw error;
        }
      }
    }
    throw new NetworkError('All retry attempts failed');
  }

  // 快捷方法
  async get<T = any>(url: string, params?: Record<string, any>, config: HttpRequestConfig = {}) {
    return this.request<T>(url, { ...config, method: 'GET', params });
  }

  async post<T = any>(url: string, data?: any, config: HttpRequestConfig = {}) {
    return this.request<T>(url, { ...config, method: 'POST', data });
  }

  async put<T = any>(url: string, data?: any, config: HttpRequestConfig = {}) {
    return this.request<T>(url, { ...config, method: 'PUT', data });
  }

  async delete<T = any>(url: string, config: HttpRequestConfig = {}) {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  async patch<T = any>(url: string, data?: any, config: HttpRequestConfig = {}) {
    return this.request<T>(url, { ...config, method: 'PATCH', data });
  }
}

// 默认请求拦截器 - 添加认证token等
const defaultRequestInterceptor = (config: HttpRequestConfig): HttpRequestConfig => {
  // 这里可以添加认证token
  // const token = Taro.getStorageSync('token');
  // if (token) {
  //   config.headers = {
  //     ...config.headers,
  //     'Authorization': `Bearer ${token}`,
  //   };
  // }
  
  // 添加请求ID用于追踪
  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  config.headers = {
    ...config.headers,
    'X-Request-ID': requestId,
  };
  
  return config;
};

// 默认响应拦截器 - 处理通用响应格式
const defaultResponseInterceptor = (response: HttpResponse): HttpResponse => {
  // 检查响应数据格式
  // 这里可以根据后端API的统一响应格式进行处理
  // 例如: { code: 0, data: {...}, message: 'success' }
  
  // 如果后端使用统一响应格式，可以在这里提取data字段
  // if (response.data && typeof response.data === 'object' && 'code' in response.data) {
  //   if (response.data.code === 0) {
  //     response.data = response.data.data;
  //   } else {
  //     throw new HttpError(
  //       response.data.message || 'API Error',
  //       response.status,
  //       response.data,
  //       response.config
  //     );
  //   }
  // }
  
  return response;
};

// 默认错误拦截器 - 统一错误处理
const defaultErrorInterceptor = (error: HttpError | NetworkError): void => {
  // 根据错误类型显示不同的用户提示
  if (error instanceof NetworkError) {
    Taro.showToast({
      title: '网络连接失败，请检查网络设置',
      icon: 'none',
      duration: 3000,
    });
  } else if (error instanceof HttpError && error.status) {
    // 根据HTTP状态码显示不同的提示
    if (error.status === 401) {
      Taro.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none',
        duration: 3000,
      });
      // 可以在这里触发重新登录逻辑
      // Taro.navigateTo({ url: '/pages/login/index' });
    } else if (error.status === 403) {
      Taro.showToast({
        title: '权限不足，无法访问',
        icon: 'none',
        duration: 3000,
      });
    } else if (error.status === 404) {
      Taro.showToast({
        title: '请求的资源不存在',
        icon: 'none',
        duration: 3000,
      });
    } else if (error.status >= 500) {
      Taro.showToast({
        title: '服务器错误，请稍后重试',
        icon: 'none',
        duration: 3000,
      });
    } else {
      Taro.showToast({
        title: error.message || '请求失败',
        icon: 'none',
        duration: 3000,
      });
    }
  }
};

// 创建配置了默认拦截器的HTTP客户端实例
class HttpClientWithInterceptors extends HttpClient {
  constructor(baseURL?: string, defaultConfig: HttpRequestConfig = {}) {
    super(baseURL, defaultConfig);
    
    // 设置默认拦截器
    this.setRequestInterceptor(defaultRequestInterceptor);
    this.setResponseInterceptor(defaultResponseInterceptor);
    this.setErrorInterceptor(defaultErrorInterceptor);
  }
}

// 创建默认HTTP客户端实例
export const httpClient = new HttpClientWithInterceptors();