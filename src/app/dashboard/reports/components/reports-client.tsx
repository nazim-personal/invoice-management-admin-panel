
"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, IndianRupee } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import { useEffect, useState } from "react";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { useToast } from "@/hooks/use-toast";
import { ReportData } from "@/lib/types/reports";
import { ReportsSkeleton } from "./reports-skeleton";
import { ApiResponseTypes } from "@/lib/types/api";


const lineChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
};

const barChartConfig = {
  sales: {
    label: "Sales Count",
    color: "hsl(var(--chart-2))",
  },
};

export function ReportsClient() {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 29)),
    to: new Date(),
  });
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const from = date?.from ? format(date.from, 'yyyy-MM-dd') : undefined;
      const to = date?.to ? format(date.to, 'yyyy-MM-dd') : undefined;
      const response: ApiResponseTypes<ReportData> = await getRequest({
        url: '/api/reports',
        params: { from, to }
      });
      setReportData(response.data);
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [date]);

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  if (!reportData) {
    return <div>No data available</div>;
  }

  const {
    totalRevenue,
    invoicesGenerated,
    avgInvoiceValue,
    topSellingProduct,
    salesData,
    topProductsData,
    revenueChange,
    invoicesChange,
    avgInvoiceChange
  } = reportData;

  return (
    <>
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-3 w-3" />
                {totalRevenue.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{invoicesGenerated}</div>
            <p className="text-xs text-muted-foreground">{invoicesChange >= 0 ? '+' : ''}{invoicesChange} from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Invoice Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-3 w-3" />
                {avgInvoiceValue}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{avgInvoiceChange >= 0 ? '+' : ''}{avgInvoiceChange.toFixed(1)}% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Selling Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline truncate">{topSellingProduct.name}</div>
            <p className="text-xs text-muted-foreground">{topSellingProduct.unitsSold} units sold</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Sales Revenue</CardTitle>
            <CardDescription>Revenue over the selected date range.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={salesData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => format(new Date(value), "MMM dd")}
                />
                <YAxis
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Line
                  dataKey="sales"
                  type="monotone"
                  stroke="var(--color-sales)"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Top Selling Products</CardTitle>
            <CardDescription>
              Products with the most sales in the period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={topProductsData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="w-20"
                />
                <XAxis dataKey="sales" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="sales" layout="vertical" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
