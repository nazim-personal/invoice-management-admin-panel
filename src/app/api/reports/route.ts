import { API_REPORTS_SUMMARY, API_REPORTS_SALES, API_REPORTS_PRODUCTS_TOP } from "@/lib/apiEndPoints";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { ApiResponse } from "@/lib/types/api";
import { ReportData } from "@/lib/types/reports";
import { nextErrorResponse } from "@/lib/helpers/axios/nextErrorResponse";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const dateParams = from && to ? { start_date: from, end_date: to } : {};

    const [summaryRes, salesRes, topProductsRes] = await Promise.all([
      withAuthProxy<ApiResponse<any>>({
        url: API_REPORTS_SUMMARY,
        method: "GET",
        params: dateParams,
      }),
      withAuthProxy<ApiResponse<any[]>>({
        url: API_REPORTS_SALES,
        method: "GET",
        params: { ...dateParams, period: "daily" }, // Default to daily for the chart
      }),
      withAuthProxy<ApiResponse<any[]>>({
        url: API_REPORTS_PRODUCTS_TOP,
        method: "GET",
        params: { ...dateParams, limit: 5 },
      }),
    ]);

    const summary = summaryRes.data.results;
    const sales = salesRes.data.results;
    const topProducts = topProductsRes.data.results;

    // Transform data to match ReportData interface
    const reportData: ReportData = {
      totalRevenue: summary.total_revenue || 0,
      invoicesGenerated: summary.total_invoices || 0,
      avgInvoiceValue: summary.avg_invoice_value || 0,
      revenueChange: summary.revenue_change_percent || 0,
      invoicesChange: summary.invoices_change_percent || 0,
      avgInvoiceChange: summary.avg_invoice_value_change_percent || 0,
      topSellingProduct: {
        name: topProducts.length > 0 ? topProducts[0].name : "N/A",
        unitsSold: topProducts.length > 0 ? topProducts[0].total_sold : 0,
      },
      salesData: sales.map((item: any) => ({
        date: item.date,
        sales: item.total_sales,
      })),
      topProductsData: topProducts.map((item: any) => ({
        name: item.name,
        sales: item.total_sold,
      })),
    };

    return NextResponse.json({
      success: true,
      message: "Reports fetched successfully",
      data: reportData,
    });
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}
