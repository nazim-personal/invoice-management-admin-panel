import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { CustomGetRequestType, CustomRequestType } from "@/lib/types/api";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: '', // Relative paths will be used
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If we were storing token in localStorage, we would attach it here.
    // But requirements say: "Attach to every request via Authorization: Bearer <token> header"
    // AND "Access Token: Store in memory or short-lived cookie."
    // If it's in a cookie (httpOnly), browser handles it.
    // If it's in memory (AuthContext), we need to inject it.
    // However, RequestService is a standalone lib.
    // Usually, we rely on cookies for Next.js apps or we need a way to get the token.
    // Given the requirement "Attach to every request via Authorization: Bearer <token> header",
    // and "Store in memory or short-lived cookie", let's assume for now the cookie is handled by the browser
    // OR we need a way to set the token.

    // If the backend expects a Bearer token, and we don't have it in a cookie that is automatically sent,
    // we might need to rely on the cookie being set by the server and sent automatically (credentials: include).
    // The requirement says "Attach to every request via Authorization: Bearer <token> header."

    // Since I don't have direct access to the AuthContext state here easily without circular deps or complex injection,
    // and often Next.js apps use cookies for auth, I will assume the token is available via a cookie
    // OR the developer will ensure the token is set.

    // BUT, let's try to read from a cookie if possible, or just proceed.
    // For now, I'll assume the browser handles cookies or we rely on the server setting an httpOnly cookie.
    // If the requirement strictly means "Authorization header", we need to know where the token is.
    // "Access Token: Store in memory or short-lived cookie."

    // Let's try to get it from a cookie named 'access_token' if it exists (client side).
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
        if (match) {
            config.headers.Authorization = `Bearer ${match[2]}`;
        }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if error code is token_expired if the backend provides specific codes
      // For now, catch all 401s

      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const refreshResponse = await axiosInstance.post('/api/auth/refresh');

        if (refreshResponse.data.success) {
            // If the refresh endpoint returns a new token in the body, we might need to save it.
            // If it sets a cookie, we are good.
            // Requirement: "Response: ... access_token ... "
            // If it returns a token, we should update our header for the retry.
            const newToken = refreshResponse.data.data?.results?.access_token;
            if (newToken) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                }
                // Also update cookie if we are using document.cookie logic above
                if (typeof document !== 'undefined') {
                    document.cookie = `access_token=${newToken}; path=/; max-age=300`; // Example
                }
            }

            return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login or let the error propagate
        // window.location.href = '/login'; // Optional: Force redirect
        // Dispatch event to trigger logout in AuthContext
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

async function handleResponse<T>(res: any): Promise<T> {
    // Axios returns the data in res.data
    const data = res.data;
    // Check for application level success flag if exists
    if (data && data.success === false) {
        throw data;
    }
    return data as T;
}

export async function getRequest<T = any>({ url, params }: CustomGetRequestType): Promise<T> {
  const res = await axiosInstance.get(url, { params });
  return handleResponse<T>(res);
}

export async function postRequest<T = any>({ url, body }: CustomRequestType): Promise<T> {
  const res = await axiosInstance.post(url, body);
  return handleResponse<T>(res);
}

export async function putRequest<T = any>({ url, body }: CustomRequestType): Promise<T> {
  const res = await axiosInstance.put(url, body);
  return handleResponse<T>(res);
}

export async function deleteRequest<T = any>({ url, body }: CustomRequestType): Promise<T> {
  const res = await axiosInstance.delete(url, { data: body });
  return handleResponse<T>(res);
}
export async function restoreRequest<T = any>({ url, body }: CustomRequestType): Promise<T> {
  const res = await axiosInstance.post(url, body);
  return handleResponse<T>(res);
}
