
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { getRequest } from '@/lib/helpers/axios/RequestService';
import { handleApiError } from '@/lib/helpers/axios/errorHandler';
import { capitalizeWords } from '@/lib/helpers/forms';
import { formatWithThousands } from '@/lib/helpers/miscellaneous';
import { DashboardApiResponseTypes, DashboardSalesPerformanceTypes, DashboardStatsTypes } from '@/lib/types/dashboard';
import { InvoiceApiResponseTypes, InvoiceDataTypes } from '@/lib/types/invoices';
import {
  ArrowRight,
  FileText,
  IndianRupee,
  Package,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import DashboardSkeleton from './skeleton';
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [chartData, setChartData] = useState<DashboardSalesPerformanceTypes[]>([]);
  const [stats, setStats] = useState<DashboardStatsTypes>()
  const [invoices, setInvoices] = useState<InvoiceDataTypes[]>([]);
  const [statsLoading, setStatsLoading] = useState(true)

  const getStats = async () => {
    setStatsLoading(true);
    try {
      const response: DashboardApiResponseTypes<DashboardStatsTypes> = await getRequest({
        url: "/api/dashboard/stats"
      });
      setStats(response.data.results);
      setInvoices(response.data?.results?.invoices);
      setChartData(response.data?.results?.sales_performance);
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
      // Set default empty/zero data so the dashboard doesn't look broken or crash
      setStats({
        total_revenue: 0,
        revenue_change_percent: 0,
        total_customers: 0,
        customers_change_percent: 0,
        pending_invoices: 0,
        total_invoices: 0,
        total_products: 0,
        sales_performance: [],
        invoices: []
      } as any); // Type casting as partial match or we can define full default object
      setInvoices([]);
      setChartData([]);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    getStats()
  }, []);

  if (statsLoading) {
    return <DashboardSkeleton />;
  }
  console.log('chartData: ', JSON.stringify(chartData));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Link href="/reports" className="animate-fade-in stagger-1">
          <Card className="hover-lift cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">
                <span className="inline-flex items-center gap-0.5">
                  <IndianRupee className="h-5 w-5" />
                  {formatWithThousands(stats?.total_revenue)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 font-medium">+{stats?.revenue_change_percent}%</span> from last month
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/customers" className="animate-fade-in stagger-2">
          <Card className="hover-lift cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stats?.total_customers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 font-medium">+{stats?.customers_change_percent}%</span> from last month
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/invoices" className="animate-fade-in stagger-3">
          <Card className="hover-lift cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stats?.pending_invoices}</div>
              <p className="text-xs text-muted-foreground mt-1">
                from a total of {stats?.total_invoices}
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/products" className="animate-fade-in stagger-4">
          <Card className="hover-lift cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Package className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stats?.total_products}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all categories
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 animate-fade-in">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Sales Performance</CardTitle>
            <CardDescription>
              Your sales performance over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                data={chartData} // this comes from your API
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)} // Apr, May, etc.
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                {/* Revenue Bar */}
                <Bar
                  dataKey="revenue"
                  fill="var(--color-total)"
                  radius={[8, 8, 0, 0]}
                  name="Revenue"
                />
                {/* Invoice Count Bar */}
                <Bar
                  dataKey="invoice_count"
                  fill="var(--color-invoice, #8884d8)"
                  radius={[8, 8, 0, 0]}
                  name="Invoice Count"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Invoices</CardTitle>
            <CardDescription>
              A list of your most recent invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <EmptyState
                        icon={<FileText className="h-12 w-12" />}
                        title="No invoices found"
                        description="Create your first invoice to get started."
                        action={{
                          label: "Create Invoice",
                          onClick: () => router.push("/invoices/new"),
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="table-row-hover">
                      <TableCell>
                        <div className="font-medium">{capitalizeWords(invoice.customer.name)}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.customer.phone}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <span className="inline-flex items-center gap-0.5 font-medium">
                            <IndianRupee className="h-3 w-3" />
                            {formatWithThousands(invoice.total_amount)}
                          </span>
                        </div>
                        {invoice.status !== 'Paid' && (
                          <div className="text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-0.5">
                              Due:
                              <IndianRupee className="h-3 w-3 ml-0" />
                              {formatWithThousands(invoice.due_amount)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            invoice.status === "Paid"
                              ? "default"
                              : invoice.status === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="capitalize"
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {invoices.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button asChild variant="ghost" size="sm" className="transition-smooth hover:gap-3">
                  <Link href="/invoices">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
