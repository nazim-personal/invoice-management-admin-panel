


import { InvoiceDetailsType } from "@/lib/types/invoices";
import { formatDate } from "./forms";

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

export function generateWhatsAppMessage(invoice: InvoiceDetailsType): string {
  const itemsList = invoice.items.map((item, index) =>
    `${index + 1}. ${item.product.name} x ${item.quantity} = ₹${formatWithThousands(item.total)}`
  ).join("\n");

  return `Invoice #${invoice.invoice_number}
Date: ${formatDate(invoice.created_at)}
Customer: ${invoice.customer.name}
Items:
${itemsList}
Subtotal: ₹${formatWithThousands(invoice.subtotal_amount)}
Discount: ₹${formatWithThousands(invoice.discount_amount)}
Tax (${invoice.tax_percent}%): ₹${formatWithThousands(invoice.tax_amount)}
Total: ₹${formatWithThousands(invoice.total_amount)}
Status: ${invoice.status}
Due Date: ${formatDate(invoice.due_date)}
Thank you for your business!`;
}
