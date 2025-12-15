// lib/withAuthProxy.ts
import { getAcessToken } from "../cookieHandler";
import API from "./API";

interface ProxyOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";
  token?: string;
}

export async function withAuthProxy<T = any>(options: ProxyOptions): Promise<T> {
  const token = options.token || await getAcessToken();
  try {
    const response = await API.request<T>({
      url: options.url,
      method: options.method || "GET",
      data: options.data,
      params: options.params,
      responseType: options.responseType,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response.data;
  } catch (err: any) {
    throw {
      status: err?.response?.status || 500,
      data: err?.response?.data || { success: false, error: "Internal Server Error" },
    };
  }
}
