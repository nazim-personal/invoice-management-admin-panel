export interface ReportData {
  totalRevenue: number;
  invoicesGenerated: number;
  avgInvoiceValue: number;
  topSellingProduct: {
    name: string;
    unitsSold: number;
  };
  salesData: { date: string; sales: number }[];
  topProductsData: { name: string; sales: number }[];
  revenueChange: number;
  invoicesChange: number;
  avgInvoiceChange: number;
}
