import { ApiResponse } from "./api";

export interface UserDataTypes {
    billing_address?: string;
    billing_city?: string;
    billing_gst?: string;
    billing_pin?: string;
    billing_state?: string;
    phone?: string | undefined
    email: string;
    name: string;
    id: string;
    role?: "user" | "admin";
    username?: string;
}

export interface UserMeResponse {
  authenticated: boolean;
  user_info: UserResultsReponseType | null;
};

export interface UserResultsReponseType {
    user_info: UserDataTypes;
}

export type UserApiResponseTypes<T = UserResultsReponseType> = ApiResponse<T>;
