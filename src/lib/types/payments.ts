import { ApiResponse } from "./api";
import { CustomerDataTypes } from "./customers";
import { InvoiceDataTypes } from "./invoices";

export interface PaymentDataTypes {
  id: string;
  invoice_id: string;
  customer_id: string;
  amount: number;
  payment_date: string;
  method: "Cash" | "Bank Transfer" | "Cheque" | "UPI" | "Other";
  reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  invoice: InvoiceDataTypes;
  customer: CustomerDataTypes;
}

export interface PaymentAggregates {
  total_received: number;
  count: number;
}

export type PaymentsApiResponseTypes<T = PaymentDataTypes | PaymentDataTypes[]> = ApiResponse<T>;
