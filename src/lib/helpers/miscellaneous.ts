
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
  const doc = new jsPDF();

  // Load font dynamically from public
  // const fontBase64 = await fetchFontAsBase64(`/fonts/NotoSans-VariableFont_wdth,wght.ttf`);
  // doc.addFileToVFS('NotoSans.ttf', fontBase64);
  // doc.addFont('NotoSans.ttf', 'NotoSans', "normal");
  // doc.setFont('NotoSans');

  // Header
  doc.setFontSize(16);
  doc.text(`Invoice: ${data.invoiceNumber}`, 10, 20);
  doc.setFontSize(12);
  doc.text(`Customer: ${data.customer.name}`, 10, 30);
  doc.text(`Total: ₹${data.total}`, 10, 40);

  // Items
  let y = 50;
  data.items.forEach(item => {
    doc.text(`${item.name} x${item.ordered_quantity} - ₹${(item.price * item.ordered_quantity)}`, 10, y);
    y += 10;
  });

  // QR code
  const upiLink = `upi://pay?pa=invoice-pilot@okhdfcbank&pn=Invoice%20Pilot%20Inc&am=${data.amountDue}&cu=INR&tn=INV-006`;
  const qrData = `Invoice: ${data.invoiceNumber}\nCustomer: ${data.customer.name}\nTotal: ₹${data.total}`;
  const qrUrl = await QRCode.toDataURL(qrData);
  doc.addImage(qrUrl, "PNG", 150, 20, 40, 40);

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

