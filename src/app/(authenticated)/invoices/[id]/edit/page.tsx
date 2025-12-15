
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { getRequest, postRequest, putRequest } from "@/lib/helpers/axios/RequestService";
import { CustomerDataTypes } from "@/lib/types/customers";
import { InvoiceApiResponseTypes, InvoiceDataTypes, InvoiceDetailsApiResponseType, InvoiceDetailsType, InvoiceItem } from "@/lib/types/invoices";
import {
  ChevronLeft,
  IndianRupee,
  Minus
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import * as React from "react";
import { useState } from "react";
import { formatWithThousands } from "@/lib/helpers/miscellaneous";
import CustomersInvoice from "../../new/customers";
import ProductsInvoice from "../../new/products";
import { EditInvoiceSkeleton } from "./edit-invoice-skeleton";


export default function EditInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams()
  const searchParams = useSearchParams();
  const customerIdFromQuery = searchParams.get("customerId");
  const from = searchParams.get("from");

  const [invoice, setInvoice] = React.useState<InvoiceDetailsType | null>(null);
  const [customers, setCustomers] = useState<CustomerDataTypes[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(customerIdFromQuery);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [tax, setTax] = React.useState(18);
  const [discount, setDiscount] = React.useState(0);
  const [amountPaid, setAmountPaid] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dueDate, setDueDate] = useState('');

  const subtotal = items
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  const taxAmount = (subtotal * (tax || 0)) / 100;

  const total = subtotal + taxAmount - (discount || 0);

  const amountDue = total - (amountPaid || 0);

  const getInvoice = async (id: string) => {
    setIsLoading(true);
    try {
      const response: InvoiceDetailsApiResponseType = await getRequest({
        url: `/api/invoices/${id}`,
      });
      if (response?.data?.results) {
        const invoice = response.data.results
        setInvoice(invoice);
        setItems(invoice.items)
        setTax(invoice.tax_percent)
        setDiscount(invoice.discount_amount)
        setAmountPaid(invoice?.payment?.amount ?? 0)
        setSelectedCustomerId(invoice.customer.id)
        setDueDate(invoice.due_date)
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

  if (isLoading || !invoice) {
    return (
      <EditInvoiceSkeleton />
    );
  }
  const handleSaveInvoice = async () => {
    try {
      if (!selectedCustomerId) {
        toast({
          title: "Missing Customer",
          description: "Please select a customer before saving the invoice.",
          variant: "destructive",
        });
        return;
      }

      if (items.length === 0) {
        toast({
          title: "No Products",
          description: "Please add at least one product to the invoice.",
          variant: "destructive",
        });
        return;
      }

      for (const item of items) {
        if (item.quantity <= 0) {
          toast({
            title: "Invalid Quantity",
            description: `Quantity for "${item.product.name}" cannot be empty or zero.`,
            variant: "destructive",
          });
          return;
        }
        if (item.quantity > item.product.stock) {
          toast({
            title: "Out of Stock",
            description: `Quantity for "${item.product.name}" exceeds available stock (${item.product.stock}).`,
            variant: "destructive",
          });
          return;
        }
      }
      console.log('items: ', items);

      setIsLoading(true);
      const invoicePayload: any = {
        customer_id: selectedCustomerId,
        due_date: dueDate,
        tax_percent: tax,
        discount_amount: discount,
        items: items.map((item) => ({
          product_id: item.product_id || item.product.id,
          quantity: item.quantity,
        })),
      };

      // Only include initial_payment if amountPaid > 0
      if (amountPaid > 0) {
        invoicePayload.initial_payment = {
          amount: amountPaid,
          method: "cash",
        };
      }
      const response: InvoiceApiResponseTypes<InvoiceDataTypes> = await putRequest({
        url: `/api/invoices/${params.id}`,
        body: invoicePayload,
      });

      toast({
        title: response.message,
        description: `Invoice ${response.data.results.invoice_number} has been updated.`,
        variant: "success",
      });

      // Reset form
      setItems([]);
      setDiscount(0);
      setAmountPaid(0);
      setTax(18);
      setSelectedCustomerId('')
      setDueDate(new Date().toISOString().split("T")[0])
      router.back();
      return response
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


  const handleDiscard = () => {
    if (from) {
      router.push(from);
    } else {
      router.back();
    }
  };

  const handleGeneratePdf = async () => {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    if (!selectedCustomerId) {
      toast({
        title: "Missing Customer",
        description: "Please select a customer before saving the invoice.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "No Products",
        description: "Please add at least one product to the invoice.",
        variant: "destructive",
      });
      return;
    }

    for (const item of items) {
      if (item.quantity <= 0) {
        toast({
          title: "Invalid Quantity",
          description: `Quantity for "${item.product.name}" cannot be empty or zero.`,
          variant: "destructive",
        });
        return;
      }
      if (item.quantity > item.product.stock) {
        toast({
          title: "Out of Stock",
          description: `Quantity for "${item.product.name}" exceeds available stock (${item.product.stock}).`,
          variant: "destructive",
        });
        return;
      }
    }

    const response = await handleSaveInvoice();
    if (response?.success) {
      try {
        // Use params.id since we are in edit mode and ID is known
        const invoiceId = params.id as string;
        const pdfResponse = await fetch(`/api/invoices/${invoiceId}/pdf`);

        if (!pdfResponse.ok) {
          throw new Error("Failed to generate PDF");
        }

        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        // Use invoice number from state if available, or fallback
        const invoiceNumber = invoice?.invoice_number || "invoice";
        a.download = `invoice-${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("PDF download error:", error);
        toast({
          title: "PDF Error",
          description: "Failed to download invoice PDF.",
          variant: "destructive",
        });
      }
    }
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleDiscard}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          Edit Invoice
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          {invoice?.invoice_number}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" onClick={handleDiscard}>
            Discard
          </Button>
          <Button size="sm" onClick={handleSaveInvoice} loading={isLoading} disabled={items.length === 0 || !selectedCustomerId}>Save Invoice</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <CustomersInvoice customers={customers} setCustomers={setCustomers} selectedCustomerId={selectedCustomerId} setSelectedCustomerId={setSelectedCustomerId} invoice_number={invoice?.invoice_number} isDisabled={true} />
          <ProductsInvoice items={items} setItems={setItems} />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="inline-flex items-center gap-0.5">
                  <IndianRupee className="h-3 w-3" />
                  {formatWithThousands(subtotal, true)}
                </span>
              </div>

              {/* Tax */}
              <div className="flex justify-between text-sm">
                <span>Tax ({invoice?.tax_percent}%)</span>
                <span className="inline-flex items-center gap-0.5">
                  <IndianRupee className="h-3 w-3" />
                  {formatWithThousands(taxAmount, true)}
                </span>
              </div>

              {/* Discount */}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span className="inline-flex items-center gap-0.5">
                    <Minus className="h-3.5 w-3.5" />
                    <IndianRupee className="h-3 w-3" />
                    {formatWithThousands(discount, true)}
                  </span>
                </div>
              )}

              {/* Due Date Input */}
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="due-date" className="flex items-center gap-2">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-36"
                />
              </div>
              <hr className="my-1 border-gray-200" />

              {/* Total */}
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="inline-flex items-center gap-0.5">
                  <IndianRupee className="h-4 w-4" />
                  {formatWithThousands(total, true)}
                </span>
              </div>

              {/* Amount Paid */}
              <div className="flex items-center justify-between">
                <Label htmlFor="amount-paid">
                  Amount Paid (
                  <span className="inline-flex items-center">
                    <IndianRupee className="h-3 w-3" />
                  </span>
                  )
                </Label>
                <Input
                  id="amount-paid"
                  type="number"
                  min={0}
                  max={isNaN(invoice?.total_amount as number) ? undefined : invoice?.total_amount} // never pass NaN
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setAmountPaid(NaN);
                      return;
                    }
                    let parsed = parseFloat(val);
                    if (!isNaN(parsed)) {
                      // clamp to total and round to 2 decimals
                      if (parsed > Number(invoice?.total_amount)) parsed = invoice?.total_amount as number;
                      parsed = Math.round(parsed * 100) / 100;
                      setAmountPaid(parsed);
                    }
                  }}
                  value={isNaN(amountPaid) ? "" : amountPaid}
                  onBlur={(e) => {
                    let parsed = parseFloat(e.target.value);
                    if (isNaN(parsed) || parsed < 0) parsed = 0;
                    if (parsed > Number(invoice?.total_amount)) parsed = invoice?.total_amount as number;
                    parsed = Math.round(parsed * 100) / 100;
                    setAmountPaid(parsed);
                  }}

                  className="w-24"
                />
              </div>


              {/* Amount Due */}
              <div className="flex justify-between text-base font-semibold text-destructive">
                <span>Amount Due</span>
                <span className="inline-flex items-center gap-0.5">
                  <IndianRupee className="h-4 w-4" />
                  {formatWithThousands(amountDue, true)}
                </span>
              </div>

              {/* Tax Input */}
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="tax" className="flex items-center gap-2">Tax (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  min={0}
                  value={isNaN(tax) ? "" : tax}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setTax(NaN);
                      return;
                    }
                    const parsed = parseInt(val, 10);
                    if (!isNaN(parsed)) setTax(parsed);
                  }}
                  onBlur={(e) => {
                    const parsed = parseInt(e.target.value, 10);
                    setTax(isNaN(parsed) || parsed < 0 ? 0 : parsed);
                  }}
                  className="w-20"
                />
              </div>

              {/* Discount Input */}
              <div className="flex items-center justify-between">
                <Label htmlFor="Discount">
                  Discount (
                  <span className="inline-flex items-center">
                    <IndianRupee className="h-3 w-3" />
                  </span>
                  )
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  value={isNaN(discount) ? "" : discount}
                  onChange={(e) => {
                    const val = e.target.value;
                    const parsed = parseFloat(val);

                    // If input is empty, set as null instead of NaN
                    if (val === "") {
                      setDiscount(NaN);
                      return;
                    }

                    if (!isNaN(parsed)) setDiscount(parsed);
                  }}
                  onBlur={(e) => {
                    const parsed = parseFloat(e.target.value);
                    // If invalid, set to 0
                    setDiscount(parsed == null || isNaN(parsed) || parsed < 0 ? 0 : parsed);
                  }}
                  className="w-24"
                />
              </div>

            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleGeneratePdf} disabled={items.length === 0 || !selectedCustomerId}>
                Generate PDF
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" onClick={handleDiscard}>
          Discard
        </Button>
        <Button size="sm" onClick={handleSaveInvoice} loading={isLoading} disabled={items.length === 0 || !selectedCustomerId}>Save Invoice</Button>
      </div>
    </main>
  );
}