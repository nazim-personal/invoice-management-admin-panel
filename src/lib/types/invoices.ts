import { ApiResponse } from "./api";
import { CustomerDataTypes } from "./customers";
import { ProductDataTypes } from "./products";

export interface InvoiceDataTypes {
  id: string;
  invoice_number: string;
  created_at: string;
  due_date: string;
  status: "Pending" | "Paid" | "Overdue" | string;
  tax_percent: number;
  tax_amount: number;
  discount_amount: number;
  subtotal_amount: number;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  updated_at: string | null;
  customer: {
    id: string;
    name: string;
    phone: string | null;
  }
}

export interface InvoiceAggregates {
  total_billed: number;
  total_paid: number;
  total_due: number;
  invoices: InvoiceDataTypes[];
}
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  product: ProductDataTypes;
}
export interface InvoiceDetailsType extends InvoiceDataTypes {
  customer: CustomerDataTypes;
  items: InvoiceItem[];
  payment: Payment;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string | null; // ISO datetime or null
  method: string; // e.g. "cash", "bank", "upi"
  reference_no: string | null;
}

export interface DeletedResponse {
  deleted_count: number
}
export type InvoiceApiResponseTypes<T = InvoiceDataTypes | InvoiceDataTypes[] | DeletedResponse> = ApiResponse<T>;
export type InvoiceDetailsApiResponseType = ApiResponse<InvoiceDetailsType>;

// export interface GenerateInvoicePDFProps {
//   invoiceNumber: string;
//   customer: CustomerDataTypes;
//   items: InvoiceItem[];
//   subtotal: number;
//   tax: number;
//   taxAmount: number;
//   discount: number;
//   total: number;
//   amountPaid: number;
//   amountDue: number;
// }
export interface GenerateInvoicePDFProps {
  invoiceNumber: string;
  date: Date | string;
  dueDate: Date | string;
  customer: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    product: {
      name: string;
      product_code?: string;
    };
    quantity: number;
    price: number;
  }>;
  subtotal?: number;
  discount?: number;
  amountPaid?: number;
  status: "paid" | "pending" | "overdue";
  notes?: string;
}