import { ApiResponse } from "./api";

export interface UserDataTypes {
    billing_address?: string;
    billing_city?: string;
    billing_gst?: string;
    billing_pin?: string;
    billing_state?: string;
    company_name?: string;
    company_address?: string;
    company_city?: string;
    company_phone?: string;
    company_email?: string;
    company_gst?: string;
    currency_symbol?: string;
    phone?: string | undefined
    email: string;
    name: string;
    id: string;
    role?: "user" | "admin" | "staff" | "manager";
    username?: string;
    permissions?: string[];
}

export interface UserMeResponse {
  authenticated: boolean;
  user_info: UserResultsReponseType | null;
};

export interface UserResultsReponseType {
    user_info: UserDataTypes;
}

export interface DeletedResponse {
    deleted_count: number
}
export type UserApiResponseTypes<T = UserResultsReponseType | DeletedResponse> = ApiResponse<T>;