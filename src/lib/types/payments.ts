import { ApiResponse } from "./api";
import { CustomerDataTypes } from "./customers";
import { InvoiceDataTypes } from "./invoices";

export type PaymentMethod = "cash" | "card" | "upi" | "bank_transfer";

export interface PaymentDataTypes {
  id: string;
  invoice_id: string;
  amount: string | number;
  payment_date: string;
  method: PaymentMethod;
  reference_no?: string;
  transaction_id?: string;
  payment_gateway?: string;
  created_at: string;
  invoice_number?: string;
  invoice_total?: string | number;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  invoice?: InvoiceDataTypes;
  customer?: CustomerDataTypes;
}

export interface PhonePePaymentResponse {
  payment_url: string;
  transaction_id: string;
  amount: number;
}

export interface PaymentAggregates {
  total_received: number;
  count: number;
}

export type PaymentsApiResponseTypes<T = PaymentDataTypes | PaymentDataTypes[]> = ApiResponse<T>;
