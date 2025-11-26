import { ApiResponse } from "./api";
import { InvoiceDataTypes } from "./invoices";

export interface DashboardStatsTypes {
    total_revenue: number;
    revenue_change_percent: number;
    total_customers: number;
    customers_change_percent: number;
    total_invoices: number;
    pending_invoices: number;
    total_products: number;
    sales_performance: DashboardSalesPerformanceTypes[];
    invoices: InvoiceDataTypes[]
}
export interface DashboardSalesPerformanceTypes {
    month: string;
    revenue: number;
    invoice_count: number;
}

export type DashboardApiResponseTypes<T = DashboardStatsTypes | DashboardSalesPerformanceTypes[]> = ApiResponse<T>;
