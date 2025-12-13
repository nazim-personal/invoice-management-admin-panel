
"use client";

import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { ReportsClient } from "./components/reports-client";
import jsPDF from "jspdf";

export default function ReportsPage() {

  const handleExportPdf = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Sales Report", 105, 20, { align: "center" });
    
    // Date Range (using static for now as in reports-client)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date Range: May 01, 2023 - May 10, 2023`, 105, 30, { align: "center" });

    let y_pos = 50;

    // Key Metrics
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Key Metrics", 20, y_pos);
    y_pos += 10;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Total Revenue: ₹35,231.89", 20, y_pos);
    doc.text("Invoices Generated: 573", 110, y_pos);
    y_pos += 8;
    doc.text("Avg. Invoice Value: ₹61.50", 20, y_pos);
    doc.text("Top Selling Product: Cloud Service", 110, y_pos);
    y_pos += 15;

    // Sales Revenue Section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Sales Revenue Data", 20, y_pos);
    y_pos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Date", 20, y_pos);
    doc.text("Sales (₹)", 70, y_pos, { align: "right" });
    y_pos += 5;
    doc.line(20, y_pos, 190, y_pos);
    y_pos += 5;
    
    doc.setFont("helvetica", "normal");
    // TODO: This data needs to be fetched and passed to this function.
    // salesData.forEach(data => {
    //     if (y_pos > 270) {
    //         doc.addPage();
    //         y_pos = 20;
    //     }
    //     doc.text(data.date, 20, y_pos);
    //     doc.text(`₹${data.sales}`, 70, y_pos, { align: "right" });
    //     y_pos += 7;
    // });
    
    y_pos += 10;

    // Top Selling Products Section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Top Selling Products", 20, y_pos);
    y_pos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Product Name", 20, y_pos);
    doc.text("Sales Count", 120, y_pos, { align: "right" });
    y_pos += 5;
    doc.line(20, y_pos, 190, y_pos);
    y_pos += 5;

    doc.setFont("helvetica", "normal");
    // TODO: This data needs to be fetched and passed to this function.
    // topProductsData.forEach(data => {
    //     if (y_pos > 270) {
    //         doc.addPage();
    //         y_pos = 20;
    //     }
    //     doc.text(data.name, 20, y_pos);
    //     doc.text(data.sales.toString(), 120, y_pos, { align: "right" });
    //     y_pos += 7;
    // });

    doc.save("sales-report.pdf");
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline tracking-tight">
            Reports
          </h1>
          <p className="text-muted-foreground">
            Analyze your sales data and performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handleExportPdf}>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export PDF
            </span>
          </Button>
        </div>
      </div>
      <ReportsClient />
    </main>
  );
}
