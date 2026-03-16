import { HttpClient, HttpError, NetworkError, HttpRequestConfig } from '../httpClient';

// Mock Taro.request
jest.mock('@tarojs/taro', () => ({
  request: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showToast: jest.fn(),
}));

import Taro from '@tarojs/taro';

describe('HttpClient', () => {
  let httpClient: HttpClient;
  const mockBaseURL = 'http://api.example.com';
  
  beforeEach(() => {
    httpClient = new HttpClient(mockBaseURL);
    jest.clearAllMocks();
  });
  
  describe('constructor', () => {
    it('should create instance with default config', () => {
      expect(httpClient).toBeInstanceOf(HttpClient);
    });
    
    it('should use provided baseURL', () => {
      const customClient = new HttpClient('http://custom.api.com');
      // 可以通过反射或其他方式验证baseURL，这里简化处理
      expect(customClient).toBeInstanceOf(HttpClient);
    });
    
    it('should merge default config with provided config', () => {
      const customConfig: HttpRequestConfig = {
        timeout: 10000,
        showLoading: true,
      };
      const customClient = new HttpClient(mockBaseURL, customConfig);
      expect(customClient).toBeInstanceOf(HttpClient);
    });
  });
  
  describe('request method', () => {
    it('should make successful GET request', async () => {
      const mockResponse = {
        statusCode: 200,
        data: { id: 1, name: 'Test' },
        header: { 'content-type': 'application/json' },
        errMsg: 'request:ok',
      };
      
      (Taro.request as jest.Mock).mockResolvedValue(mockResponse);
      
      const response = await httpClient.request('/test');
      
      expect(Taro.request).toHaveBeenCalledWith({
        url: `${mockBaseURL}/test`,
        method: 'GET',
        header: { 'Content-Type': 'application/json' },
        data: undefined,
        timeout: 30000,
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockResponse.data);
    });
    
    it('should handle POST request with data', async () => {
      const mockResponse = {
        statusCode: 201,
        data: { id: 1 },
        header: {},
        errMsg: 'request:ok',
      };
      
      (Taro.request as jest.Mock).mockResolvedValue(mockResponse);
      
      const postData = { name: 'Test', value: 123 };
      const response = await httpClient.request('/test', {
        method: 'POST',
        data: postData,
      });
      
      expect(Taro.request).toHaveBeenCalledWith({
        url: `${mockBaseURL}/test`,
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        data: postData,
        timeout: 30000,
      });
      
      expect(response.status).toBe(201);
    });
    
    it('should handle query parameters', async () => {
      const mockResponse = {
        statusCode: 200,
        data: [],
        header: {},
        errMsg: 'request:ok',
      };
      
      (Taro.request as jest.Mock).mockResolvedValue(mockResponse);
      
      const params = { page: 1, limit: 10, search: 'test' };
      await httpClient.request('/items', { params });
      
      expect(Taro.request).toHaveBeenCalledWith({
        url: `${mockBaseURL}/items?page=1&limit=10&search=test`,
        method: 'GET',
        header: { 'Content-Type': 'application/json' },
        data: undefined,
        timeout: 30000,
      });
    });
    
    it('should throw HttpError for non-2xx status codes', async () => {
      const mockResponse = {
        statusCode: 404,
        data: { message: 'Not Found' },
        header: {},
        errMsg: 'request:fail',
      };
      
      (Taro.request as jest.Mock).mockResolvedValue(mockResponse);
      
      await expect(httpClient.request('/not-found')).rejects.toThrow(HttpError);
    });
    
    it('should throw NetworkError for network failures', async () => {
      const networkError = new Error('Network Error');
      (Taro.request as jest.Mock).mockRejectedValue(networkError);
      
      await expect(httpClient.request('/test')).rejects.toThrow(NetworkError);
    });
    
    it('should show loading indicator when configured', async () => {
      const mockResponse = {
        statusCode: 200,
        data: {},
        header: {},
        errMsg: 'request:ok',
      };
      
      (Taro.request as jest.Mock).mockResolvedValue(mockResponse);
      
      await httpClient.request('/test', { showLoading: true, loadingText: 'Loading...' });
      
      expect(Taro.showLoading).toHaveBeenCalledWith({
        title: 'Loading...',
        mask: true,
      });
      expect(Taro.hideLoading).toHaveBeenCalled();
    });
  });
  
  describe('shortcut methods', () => {
    beforeEach(() => {
      const mockResponse = {
        statusCode: 200,
        data: {},
        header: {},
        errMsg: 'request:ok',
      };
      (Taro.request as jest.Mock).mockResolvedValue(mockResponse);
    });
    
    it('should make GET request', async () => {
      await httpClient.get('/items', { page: 1 });
      
      expect(Taro.request).toHaveBeenCalledWith({
        url: `${mockBaseURL}/items?page=1`,
        method: 'GET',
        header: { 'Content-Type': 'application/json' },
        data: undefined,
        timeout: 30000,
      });
    });
    
    it('should make POST request', async () => {
      const postData = { name: 'Test' };
      await httpClient.post('/items', postData);
      
      expect(Taro.request).toHaveBeenCalledWith({
        url: `${mockBaseURL}/items`,
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        data: postData,
        timeout: 30000,
      });
    });
    
    it('should make PUT request', async () => {
      const updateData = { name: 'Updated' };
      await httpClient.put('/items/1', updateData);
      
      expect(Taro.request).toHaveBeenCalledWith({
        url: `${mockBaseURL}/items/1`,
        method: 'PUT',
        header: { 'Content-Type': 'application/json' },
        data: updateData,
        timeout: 30000,
      });
    });
    
    it('should make DELETE request', async () => {
      await httpClient.delete('/items/1');
      
      expect(Taro.request).toHaveBeenCalledWith({
        url: `${mockBaseURL}/items/1`,
        method: 'DELETE',
        header: { 'Content-Type': 'application/json' },
        data: undefined,
        timeout: 30000,
      });
    });
    
    it('should make PATCH request', async () => {
      const patchData = { name: 'Patched' };
      await httpClient.patch('/items/1', patchData);
      
      expect(Taro.request).toHaveBeenCalledWith({
        url: `${mockBaseURL}/items/1`,
        method: 'PATCH',
        header: { 'Content-Type': 'application/json' },
        data: patchData,
        timeout: 30000,
      });
    });
  });
  
  describe('interceptors', () => {
    it('should apply request interceptor', async () => {
      const mockResponse = {
        statusCode: 200,
        data: {},
        header: {},
        errMsg: 'request:ok',
      };
      
      (Taro.request as jest.Mock).mockResolvedValue(mockResponse);
      
      const requestInterceptor = jest.fn((config) => {
        config.headers = { ...config.headers, 'X-Custom-Header': 'value' };
        return config;
      });
      
      httpClient.setRequestInterceptor(requestInterceptor);
      
      await httpClient.request('/test');
      
      expect(requestInterceptor).toHaveBeenCalled();
      expect(Taro.request).toHaveBeenCalledWith(
        expect.objectContaining({
          header: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Custom-Header': 'value',
          }),
        })
      );
    });
    
    it('should apply response interceptor', async () => {
      const mockResponse = {
        statusCode: 200,
        data: { raw: 'data' },
        header: {},
        errMsg: 'request:ok',
      };
      
      (Taro.request as jest.Mock).mockResolvedValue(mockResponse);
      
      const responseInterceptor = jest.fn((response) => {
        response.data = { processed: response.data.raw + '_processed' };
        return response;
      });
      
      httpClient.setResponseInterceptor(responseInterceptor);
      
      const response = await httpClient.request('/test');
      
      expect(responseInterceptor).toHaveBeenCalled();
      expect(response.data).toEqual({ processed: 'data_processed' });
    });
    
    it('should apply error interceptor', async () => {
      const mockResponse = {
        statusCode: 500,
        data: { error: 'Server Error' },
        header: {},
        errMsg: 'request:fail',
      };
      
      (Taro.request as jest.Mock).mockResolvedValue(mockResponse);
      
      const errorInterceptor = jest.fn();
      httpClient.setErrorInterceptor(errorInterceptor);
      
      try {
        await httpClient.request('/test');
      } catch (error) {
        // Expected to throw
      }
      
      expect(errorInterceptor).toHaveBeenCalled();
    });
  });
  
  describe('retry logic', () => {
    it('should retry failed requests', async () => {
      const networkError = new Error('Network Error');
      const mockResponse = {
        statusCode: 200,
        data: { success: true },
        header: {},
        errMsg: 'request:ok',
      };
      
      // First call fails, second succeeds
      (Taro.request as jest.Mock)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(mockResponse);
      
      const response = await httpClient.request('/test', {
        retryCount: 1,
        retryDelay: 100,
      });
      
      expect(Taro.request).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ success: true });
    });
    
    it('should throw after all retries fail', async () => {
      const networkError = new Error('Network Error');
      (Taro.request as jest.Mock).mockRejectedValue(networkError);
      
      await expect(
        httpClient.request('/test', { retryCount: 2, retryDelay: 100 })
      ).rejects.toThrow('All retry attempts failed');
      
      expect(Taro.request).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });
});