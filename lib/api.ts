// src/lib/api.ts
import config from './config';

export const apiClient = {
  baseUrl: config.apiBaseUrl,

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // اكتشف إذا كان الـ body من نوع FormData
    const isFormData = options.body instanceof FormData;

    // إذا كان formData، لا تضع Content-Type يدويًا
    const headersToUse = isFormData
      ? options.headers || {}
      : {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        };

    const finalOptions: RequestInit = {
      ...options,
      headers: headersToUse,
    };

    return fetch(url, finalOptions);
  },

  get: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),

  // ✅ دالة upload معدّلة — لا حاجة لتغييرها، لأن request الآن ذكية
  upload: (endpoint: string, formData: FormData, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    }),
};

export default apiClient;