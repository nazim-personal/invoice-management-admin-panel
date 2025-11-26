// types/api.ts
export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: {
    meta: MetaTypes;
    results: T;
  };
  error: {
    details: string;
  };
}

export interface MetaTypes {
  page: number
  limit: number
  total: number
}
export interface CustomRequestType { url: string, body: any }
export interface CustomGetRequestType { url: string, params?: Record<string, any> }