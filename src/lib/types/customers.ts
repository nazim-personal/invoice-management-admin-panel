import { ApiResponse } from "./api";
import { InvoiceDataTypes } from "./invoices";

export interface CustomerDataTypes {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    gst_number?: string | null;
    created_at: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    status?: string | null
}
export interface CustomerAggregates {
  total_billed: number;
  total_paid: number;
  total_due: number;
  invoices: InvoiceDataTypes[];
}
export interface CustomerDetailsType extends CustomerDataTypes {
  aggregates: CustomerAggregates;
}

export interface DeletedResponse {
    deleted_count: number
}
export type CustomerApiResponseTypes<T = CustomerDataTypes | CustomerDataTypes[] | DeletedResponse> = ApiResponse<T>;
export type CustomerDetailsApiResponseType = ApiResponse<CustomerDetailsType>;
