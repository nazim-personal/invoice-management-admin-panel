import { CustomGetRequestType, CustomRequestType } from "@/lib/types/api";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok || data?.success === false) {    
    throw data
  }
  return data as T;
}

async function safeFetch(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // ⏱ 15s timeout
  try {
    return await fetch(url, {
      ...options,
      credentials: "include",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function buildUrl(url: string, params?: Record<string, any>): string {
  if (!params) return url;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });
  return query.toString() ? `${url}?${query.toString()}` : url;
}

export async function getRequest<T = any>({ url, params }: CustomGetRequestType): Promise<T> {
  const finalUrl = buildUrl(url, params);
  const res = await safeFetch(finalUrl, { method: "GET" });
  return handleResponse<T>(res);
}

export async function postRequest<T = any>({ url, body }: CustomRequestType): Promise<T> {
  const res = await safeFetch(url, {
    method: "POST",
    headers: { ...DEFAULT_HEADERS },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function putRequest<T = any>({ url, body }: CustomRequestType): Promise<T> {
  const res = await safeFetch(url, {
    method: "PUT",
    headers: { ...DEFAULT_HEADERS },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function deleteRequest<T = any>({ url, body }: CustomRequestType): Promise<T> {
  const res = await safeFetch(url, {
    method: "DELETE",
    headers: { ...DEFAULT_HEADERS },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}
