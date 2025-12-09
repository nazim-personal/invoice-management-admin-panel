
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { GenerateInvoicePDFProps } from "../types/invoices";

// Currency formatter with ₹ + Indian commas
export const formatCurrency = (amount: number) => {
  return `₹${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

export async function fetchFontAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load font at ${url}`);
  const buffer = await res.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
  return base64;
}

export async function generateInvoicePDF(data: GenerateInvoicePDFProps) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Constants
  const PAGE_WIDTH = doc.internal.pageSize.width;
  const PAGE_HEIGHT = doc.internal.pageSize.height;
  const MARGIN = 15;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const TAX_PERCENTAGE = 18; // Always 18% tax

  // Colors
  const PRIMARY_COLOR = [59, 130, 246]; // Blue-500
  const SECONDARY_COLOR = [107, 114, 128]; // Gray-500
  const ACCENT_COLOR = [16, 185, 129]; // Emerald-500
  const LIGHT_GRAY = [243, 244, 246];
  const DARK_GRAY = [55, 65, 81];

  // Helper functions
  const drawLine = (y: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatCurrencyString = (amount: number) => {
    return formatCurrency(amount).replace("₹", "");
  };

  let currentY = 20;

  // Header Section
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.rect(0, 0, PAGE_WIDTH, 25, "F");

  // Company Info (Left)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE PILOT", MARGIN, 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("123 Business Street, Mumbai, MH 400001", MARGIN, 17);
  doc.text("GSTIN: 27ABCDE1234F1Z5 | Phone: +91 98765 43210", MARGIN, 21);

  // Invoice Info (Right)
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", PAGE_WIDTH - MARGIN, 12, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`#${data.invoiceNumber}`, PAGE_WIDTH - MARGIN, 18, { align: "right" });

  doc.setFontSize(8);
  doc.text(`Date: ${new Date(data.date).toLocaleDateString("en-IN")}`, PAGE_WIDTH - MARGIN, 22, { align: "right" });

  currentY = 35;

  // Bill To Section
  doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", MARGIN, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(data.customer.name, MARGIN, currentY + 6);
  if (data.customer.address) {
    doc.text(data.customer.address, MARGIN, currentY + 11);
  }
  if (data.customer.phone) {
    doc.text(`Phone: ${data.customer.phone}`, MARGIN, currentY + 16);
  }
  if (data.customer.email) {
    doc.text(`Email: ${data.customer.email}`, MARGIN, currentY + 21);
  }

  // Invoice Details (Right side)
  const detailsX = PAGE_WIDTH - MARGIN - 60;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE DETAILS", PAGE_WIDTH - MARGIN, currentY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  let detailY = currentY + 6;
  doc.text("Invoice #:", detailsX, detailY);
  doc.text(data.invoiceNumber, PAGE_WIDTH - MARGIN, detailY, { align: "right" });

  detailY += 5;
  doc.text("Invoice Date:", detailsX, detailY);
  doc.text(new Date(data.date).toLocaleDateString("en-IN"), PAGE_WIDTH - MARGIN, detailY, { align: "right" });

  detailY += 5;
  doc.text("Due Date:", detailsX, detailY);
  doc.text(new Date(data.dueDate).toLocaleDateString("en-IN"), PAGE_WIDTH - MARGIN, detailY, { align: "right" });

  detailY += 5;
  doc.text("Payment Status:", detailsX, detailY);
  const statusColor = data.status === "paid" ? ACCENT_COLOR : [239, 68, 68];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(data.status.toUpperCase(), PAGE_WIDTH - MARGIN, detailY, { align: "right" });
  doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);

  currentY = Math.max(currentY + 30, detailY + 10);
  drawLine(currentY);
  currentY += 10;

  // Table Header
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.rect(MARGIN, currentY, CONTENT_WIDTH, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  // Define column positions
  const colNo = MARGIN + 5;
  const colDesc = MARGIN + 15;
  const colQty = MARGIN + 90;
  const colPrice = MARGIN + 110;
  const colAmount = PAGE_WIDTH - MARGIN - 10;

  doc.text("#", colNo, currentY + 5.5);
  doc.text("DESCRIPTION", colDesc, currentY + 5.5);
  doc.text("QTY", colQty, currentY + 5.5);
  doc.text("PRICE", colPrice, currentY + 5.5);
  doc.text("AMOUNT", colAmount, currentY + 5.5, { align: "right" });

  currentY += 10;

  // Items Table Content
  doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);
  doc.setFont("helvetica", "normal");
  let itemNumber = 1;

  data.items.forEach((item, index) => {
    if (currentY > PAGE_HEIGHT - 80) {
      doc.addPage();
      currentY = 20;

      // Redraw table header on new page
      doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      doc.rect(MARGIN, currentY, CONTENT_WIDTH, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("#", colNo, currentY + 5.5);
      doc.text("DESCRIPTION", colDesc, currentY + 5.5);
      doc.text("QTY", colQty, currentY + 5.5);
      doc.text("PRICE", colPrice, currentY + 5.5);
      doc.text("AMOUNT", colAmount, currentY + 5.5, { align: "right" });
      currentY += 10;
      doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);
      doc.setFont("helvetica", "normal");
    }

    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(LIGHT_GRAY[0], LIGHT_GRAY[1], LIGHT_GRAY[2]);
      doc.rect(MARGIN, currentY - 3, CONTENT_WIDTH, 10, "F");
    }

    doc.setFontSize(9);

    // Item number
    doc.text(itemNumber.toString(), colNo, currentY + 5);

    // Product description
    const maxDescWidth = colQty - colDesc - 5;
    const descText = `${item.product.name}\n${item.product.product_code || "SKU: N/A"}`;
    const descLines = doc.splitTextToSize(descText, maxDescWidth);

    descLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, colDesc, currentY + 5 + (lineIndex * 4));
    });

    // Quantity, Price, Amount
    doc.text(item.quantity.toString(), colQty, currentY + 5);
    doc.text(formatCurrencyString(item.price), colPrice, currentY + 5);
    doc.text(formatCurrencyString(item.price * item.quantity), colAmount, currentY + 5, { align: "right" });

    const descHeight = Math.max(descLines.length * 4, 10);
    currentY += descHeight;
    itemNumber++;

    // Draw line between items
    if (index < data.items.length - 1) {
      drawLine(currentY - 2);
      currentY += 5;
    }
  });

  // Draw bottom line of table
  drawLine(currentY);
  currentY += 10;

  // Calculate totals based on reference
  const subtotal = data.subtotal || data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (TAX_PERCENTAGE / 100);
  const discount = data.discount || 0;
  const amountPaid = data.amountPaid || 0;
  const total = subtotal + tax - discount;
  const amountDue = total - amountPaid;

  // Totals Section - RIGHT ALIGNED
  const totalsX = PAGE_WIDTH - MARGIN - 70;
  let totalsY = currentY;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  // Subtotal
  doc.text("Subtotal:", totalsX, totalsY);
  doc.text(formatCurrencyString(subtotal), PAGE_WIDTH - MARGIN, totalsY, { align: "right" });
  totalsY += 6;

  // Tax (18%) - Always show since it's always 18%
  doc.text(`Tax (${TAX_PERCENTAGE}%):`, totalsX, totalsY);
  doc.text(formatCurrencyString(tax), PAGE_WIDTH - MARGIN, totalsY, { align: "right" });
  totalsY += 6;

  // Discount (if exists)
  if (discount > 0) {
    doc.text("Discount:", totalsX, totalsY);
    doc.text(`-${formatCurrencyString(discount)}`, PAGE_WIDTH - MARGIN, totalsY, { align: "right" });
    totalsY += 6;
  }

  // Total line (before amount paid/due)
  doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.setLineWidth(0.3);
  doc.line(totalsX - 10, totalsY + 2, PAGE_WIDTH - MARGIN, totalsY + 2);
  totalsY += 5;

  // Total (Subtotal + Tax - Discount)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", totalsX, totalsY);
  doc.text(formatCurrencyString(total), PAGE_WIDTH - MARGIN, totalsY, { align: "right" });
  totalsY += 8;

  // Amount Paid
  if (amountPaid > 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Amount Paid:", totalsX, totalsY);
    doc.text(`-${formatCurrencyString(amountPaid)}`, PAGE_WIDTH - MARGIN, totalsY, { align: "right" });
    totalsY += 6;
  }

  // Amount Due
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Amount Due:", totalsX, totalsY);
  doc.text(formatCurrencyString(amountDue), PAGE_WIDTH - MARGIN, totalsY, { align: "right" });
  totalsY += 10;

  // Grand Total Line
  doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.setLineWidth(0.5);
  doc.line(totalsX - 10, totalsY + 2, PAGE_WIDTH - MARGIN, totalsY + 2);
  totalsY += 8;

  // GRAND TOTAL (Final amount due)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text("GRAND TOTAL:", totalsX, totalsY);
  doc.text(formatCurrencyString(amountDue), PAGE_WIDTH - MARGIN, totalsY, { align: "right" });

  // Reset text color
  doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);

  // Left side: Notes and QR Code
  const leftSideY = currentY;

  // Notes Section (if exists)
  if (data.notes) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("NOTES", MARGIN, leftSideY);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const notesLines = doc.splitTextToSize(data.notes, 60);
    doc.text(notesLines, MARGIN, leftSideY + 6);
  }

  // QR Code Section
  const qrY = Math.max(leftSideY + (data.notes ? 30 : 0), totalsY + 20);

  try {
    const qrData = `Invoice: ${data.invoiceNumber}\nAmount: ${formatCurrency(amountDue)}\nCustomer: ${data.customer.name}`;
    const qrUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 1,
      color: {
        dark: `#${PRIMARY_COLOR[0].toString(16).padStart(2, '0')}${PRIMARY_COLOR[1].toString(16).padStart(2, '0')}${PRIMARY_COLOR[2].toString(16).padStart(2, '0')}`,
        light: "#FFFFFF"
      }
    });

    doc.addImage(qrUrl, "PNG", MARGIN, qrY, 35, 35);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
    doc.text("Scan to Pay via UPI", MARGIN, qrY + 38);
    doc.text(`Amount: ${formatCurrencyString(amountDue)}`, MARGIN, qrY + 42);
  } catch (error) {
    console.error("Error generating QR code:", error);
  }

  // Footer
  const footerY = PAGE_HEIGHT - 20;
  drawLine(footerY - 5);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text("Thank you for your business!", PAGE_WIDTH / 2, footerY, { align: "center" });

  doc.setFontSize(7);
  doc.text("Invoice Pilot Inc. | GSTIN: 27ABCDE1234F1Z5 | www.invoicepilot.com", PAGE_WIDTH / 2, footerY + 5, { align: "center" });
  doc.text("This is a computer-generated invoice", PAGE_WIDTH / 2, footerY + 10, { align: "center" });

  // Page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 10, { align: "right" });
  }

  // Save the PDF
  doc.save(`Invoice-${data.invoiceNumber}.pdf`);
}

export function formatWithThousands(
  value: number | string | undefined,
  keepDecimalsIfZero: boolean = false // default: remove .00
): string {
  if (value === undefined || value === null) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);

  const isInteger = num % 1 === 0;

  return num.toLocaleString("en-IN", {
    minimumFractionDigits: isInteger
      ? (keepDecimalsIfZero ? 2 : 0)
      : 2,
    maximumFractionDigits: 2,
  });
}

