
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { formatDate } from "@/lib/helpers/forms";
import { formatWithThousands, generateInvoicePDF } from "@/lib/helpers/miscellaneous";
import { InvoiceDetailsApiResponseType, InvoiceDetailsType } from "@/lib/types/invoices";
import { ChevronLeft, Download, IndianRupee, Minus, Pencil } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import * as React from "react";
import { ViewInvoiceSkeleton } from "./view-invoice-skeleton";


const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="mr-2 h-4 w-4"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.43 16.84L2.05 22L7.31 20.62C8.75 21.41 10.36 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2ZM12.04 20.13C10.56 20.13 9.13 19.74 7.89 19L7.5 18.78L4.85 19.5L5.64 16.93L5.41 16.55C4.68 15.22 4.26 13.62 4.26 11.91C4.26 7.6 7.76 4.1 12.04 4.1C16.32 4.1 19.82 7.6 19.82 11.91C19.82 16.22 16.32 20.13 12.04 20.13ZM16.56 14.45C16.31 14.18 15.82 13.91 15.42 13.73L13.52 12.83C13.29 12.72 13.12 12.66 12.97 12.89C12.82 13.12 12.22 13.79 12.04 13.97C11.86 14.15 11.68 14.18 11.43 14.06C10.93 13.84 10.01 13.49 9.02 12.59C8.21 11.88 7.64 11.03 7.47 10.76C7.3 10.49 7.42 10.33 7.55 10.2C7.66 10.09 7.81 9.92 7.96 9.77C8.11 9.62 8.17 9.49 8.29 9.26C8.41 9.03 8.35 8.86 8.26 8.71L7.78 7.5C7.67 7.23 7.55 7.25 7.44 7.25H7.04C6.84 7.25 6.56 7.31 6.34 7.53C6.12 7.76 5.59 8.24 5.59 9.24C5.59 10.24 6.37 11.2 6.52 11.38C6.67 11.56 7.81 13.44 9.73 14.35C11.65 15.25 11.68 14.86 12.28 14.8C12.88 14.74 14.18 14.06 14.43 13.4C14.68 12.74 14.68 12.18 14.62 12.06C14.56 11.94 14.38 11.88 14.13 11.76L13.88 11.7C13.62 11.82 13.4 11.91 13.24 12.09C13.08 12.27 12.83 12.57 12.83 12.94C12.83 13.31 13.23 13.65 13.35 13.76C13.47 13.88 15.35 14.89 16.05 15.17C16.75 15.46 16.75 15.34 16.81 15.01C16.87 14.68 16.81 14.71 16.56 14.45Z" />
  </svg>
);


export default function ViewInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [invoice, setInvoice] = React.useState<InvoiceDetailsType | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const getInvoice = async (id: string) => {
    setIsLoading(true);
    try {
      const response: InvoiceDetailsApiResponseType = await getRequest({
        url: `/api/invoices/${id}`,
      });
      if (response?.data?.results) {
        setInvoice(response.data.results);
      } else {
        throw new Error("Invoice not found");
      }
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

  React.useEffect(() => {
    if (params?.id) getInvoice(params.id as string);
  }, [params?.id]);

  React.useEffect(() => {
    if (!invoice) return;

    if (invoice.due_amount > 0) {
      const upiLink = `upi://pay?pa=invoice-pilot@okhdfcbank&pn=Invoice%20Pilot%20Inc&am=${invoice.due_amount}&cu=INR&tn=${invoice.invoice_number}`;
      QRCode.toDataURL(upiLink)
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error("Failed to generate QR code", err));
    } else {
      setQrCodeDataUrl(null);
    }
  }, [invoice]);
  if (isLoading || !invoice) {
    return (
      <ViewInvoiceSkeleton />
    );
  }
  console.log('invoice: ', invoice);

  const { customer, items } = invoice;


  const handleSendWhatsApp = () => {
    if (!customer?.phone) {
      toast({
        title: "Customer phone number not available",
        variant: "destructive",
      });
      return;
    }

    const phoneNumber = customer.phone.replace(/[^0-9]/g, "");
    const message = `Hello ${customer.name},\n\nHere is your invoice ${invoice.invoice_number} for ₹${invoice.total_amount}.\nAmount Due: ₹${invoice.due_amount}\n\nThank you for your business!`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleGeneratePdf = async () => {
    // await generateInvoicePDF({
    //   invoiceNumber: 'IBV', // dynamic
    //   customer,
    //   items,
    //   subtotal: invoice.subtotal_amount,
    //   tax: invoice.tax_percent,
    //   taxAmount: invoice.tax_amount,
    //   discount: invoice.discount_amount,
    //   total: invoice.total_amount,
    //   amountPaid: invoice.paid_amount,
    //   amountDue: invoice.due_amount
    // });
 await generateInvoicePDF({
        invoiceNumber: 'IBV', // dynamic
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date().toISOString().split("T")[0],
        customer,
        items,
        // total: invoice.total_amount,
        // amountDue: invoice.due_amount,
        subtotal: invoice.subtotal_amount,
        // tax: invoice.tax_percent,
        discount: invoice.discount_amount,
        status: "paid",
        // shipping: 123,
        notes: "Thank you for your business!"
        // taxAmount,
        // amountPaid
      });
    // doc.save(`invoice-${invoice_number}.pdf`);
  };

  const handleEdit = () => {
    const from = searchParams.get('from');
    let editUrl = `/dashboard/invoices/${invoice?.id}/edit`;
    if (from) {
      editUrl += `?from=${encodeURIComponent(from)}`;
    }
    router.push(editUrl);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          Invoice {invoice.invoice_number}
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0 capitalize">
          {invoice.status}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" onClick={handleSendWhatsApp}>
            <WhatsAppIcon />
            Send
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button size="sm" onClick={handleGeneratePdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-3xl">{invoice.invoice_number}</CardTitle>
            <CardDescription>
              Issued on {formatDate(invoice.created_at)}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="font-semibold">Invoice Pilot Inc.</div>
            <div className="text-sm text-muted-foreground">
              123 App Street, Dev City<br />
              GST: 12ABCDE1234F1Z5<br />
              Phone: +91 123 456 7890<br />
              Email: billing@pilot.com
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Bill To:</div>
              <div className="font-semibold">{customer.name}</div>
              <div>{customer.address}</div>
              <div>{customer.email}</div>
              <div>{customer.phone}</div>
              <div>{customer.gst_number}</div>
            </div>
            {qrCodeDataUrl && (
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="text-sm text-muted-foreground">Scan to Pay</div>
                <Image src={qrCodeDataUrl} alt="UPI QR Code" width={120} height={120} />
              </div>
            )}
          </div>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5">Product Name</TableHead>
                  <TableHead className="w-2/5">Product Code</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.product.name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.product.product_code}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-0.5">
                        <IndianRupee className="h-3 w-3" />
                        {formatWithThousands(item.price)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-0.5">
                        <IndianRupee className="h-3 w-3" />
                        {formatWithThousands(item.total)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="w-full max-w-sm space-y-2">
            {/* Due Date */}
            {
              invoice.due_date && (
                <div className="flex justify-between">
                  <span>Due Date</span>
                  <span>{invoice.due_date ? formatDate(invoice.due_date) : "-"}</span>
                </div>
              )
            }
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-3 w-3" />
                {formatWithThousands(invoice.subtotal_amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({invoice.tax_percent}%)</span>
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-3 w-3" />
                {formatWithThousands(invoice.tax_amount)}
              </span>
            </div>
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="inline-flex items-center gap-0.5">
                  <Minus className="h-3.5 w-3.5" />
                  <IndianRupee className="h-3 w-3" />
                  {formatWithThousands(invoice.discount_amount)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-3 w-3" />
                {formatWithThousands(invoice.total_amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount Paid</span>
              <span className="inline-flex items-center gap-0.5">
                <Minus className="h-3.5 w-3.5" />
                <IndianRupee className="h-3 w-3" />
                {formatWithThousands(invoice?.payment?.amount ?? 0)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-destructive text-md border-t pt-2">
              <span>Amount Due</span>
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-3 w-3" />
                {formatWithThousands(invoice.due_amount, true)}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={handleSendWhatsApp}>
          <WhatsAppIcon />
          Send
        </Button>
        <Button size="sm" onClick={handleGeneratePdf}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </main>
  );
}
