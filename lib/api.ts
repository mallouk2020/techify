// src/lib/api.ts
import config from './config';

const LOCAL_FALLBACK_ORIGIN =
  process.env.NEXT_PUBLIC_LOCAL_API_ORIGIN || 'http://localhost:3001';

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const ensureLeadingSlash = (value: string) =>
  value.startsWith('/') ? value : `/${value}`;

const trimTrailingSlash = (value: string) =>
  (value.endsWith('/') ? value.slice(0, -1) : value);

const looksLikeLocalhost = (value?: string | null) =>
  value ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value) : false;

export const apiClient = {
  baseUrl: config.apiBaseUrl,

  async request(endpoint: string, options: RequestInit = {}) {
    const requestIsAbsolute = isAbsoluteUrl(endpoint);
    const normalizedEndpoint = requestIsAbsolute
      ? endpoint
      : ensureLeadingSlash(endpoint);

    const isBrowser = typeof window !== 'undefined';

    let resolvedBaseUrl = this.baseUrl;
    const baseUrlLooksLocal = looksLikeLocalhost(this.baseUrl);

    if (!requestIsAbsolute) {
      if (!baseUrlLooksLocal && this.baseUrl) {
        resolvedBaseUrl = this.baseUrl;
      } else if (isBrowser) {
        const hostname = window.location.hostname;
        const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

        if (isLocalHost) {
          resolvedBaseUrl = LOCAL_FALLBACK_ORIGIN;
        }
      } else {
        const isHostedEnvironment = Boolean(
          process.env.VERCEL || process.env.RAILWAY_STATIC_URL || process.env.AWS_REGION,
        );

        if (!isHostedEnvironment) {
          resolvedBaseUrl =
            process.env.LOCAL_API_ORIGIN || process.env.NEXT_PUBLIC_LOCAL_API_ORIGIN || LOCAL_FALLBACK_ORIGIN;
        }
      }
    }

    const base = trimTrailingSlash(resolvedBaseUrl);
    const url = requestIsAbsolute ? normalizedEndpoint : `${base}${normalizedEndpoint}`;

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