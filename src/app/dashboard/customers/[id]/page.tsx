
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { deleteRequest, getRequest, putRequest } from "@/lib/helpers/axios/RequestService";
import { CustomerDetailsApiResponseType, CustomerDetailsType } from "@/lib/types/customers";
import {
  ChevronLeft,
  CircleDollarSign,
  Eye,
  IndianRupee,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import { CustomerForm } from "../components/customer-form";
import { DeletedResponse, InvoiceApiResponseTypes, InvoiceDataTypes } from "@/lib/types/invoices";
import { CustomerDetailsSkeleton } from "./skeleton";
import { capitalizeWords, formatDate } from "@/lib/helpers/forms";

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


export default function ViewCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [customer, setCustomer] = React.useState<CustomerDetailsType>()
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const getCustomer = async (id: string) => {
    setIsLoading(true);
    try {
      const response: CustomerDetailsApiResponseType = await getRequest({
        url: `/api/customers/${id}`,
      });
      setCustomer(response.data.results);
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
    getCustomer(params.id as string);
  }, [params.id, router]);

  if (isLoading) {
    return <CustomerDetailsSkeleton />;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  const handleMarkAsPaid = async (invoiceId: string) => {
    const currentInvoice = customer.aggregates.invoices.find((i) => i.id === invoiceId)
    const invoicePayload = {
      amount_paid: currentInvoice?.total_amount,
      is_mark_as_paid: true
    };
    const response: InvoiceApiResponseTypes<InvoiceDataTypes> = await putRequest({
      url: `/api/invoices/${invoiceId}`,
      body: invoicePayload,
    });
    toast({
      title: response.message,
      description: `Invoice ${response.data.results.invoice_number} mark as paid.`,
      variant: "success",
    });
    getCustomer(params.id as string)
  };


  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const deleteInvoices: InvoiceApiResponseTypes<DeletedResponse> = await deleteRequest({
        url: "/api/invoices",
        body: { ids: [invoiceId] },
      });
      toast({
        title: deleteInvoices.message,
        description: `${deleteInvoices.data.results.deleted_count} invoice deleted.`,
        variant: "success",
      });
      getCustomer(params.id as string)
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    }
  };

  const handleSendWhatsApp = (invoice: InvoiceDataTypes) => {
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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.push('/dashboard/customers')}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          {capitalizeWords(customer.name)}
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0 capitalize">
          Customer
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-headline">Edit Customer</DialogTitle>
                <DialogDescription>
                  Update the details of your customer.
                </DialogDescription>
              </DialogHeader>
              <CustomerForm
                customer={customer}
                onSave={async (updated) => {
                  if (updated) {
                    setCustomer(updated as CustomerDetailsType);
                    await getCustomer(updated.id);
                  }
                  setIsFormOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-6 w-6" strokeWidth={3} />
                {customer.aggregates.total_billed}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Across {customer.aggregates.invoices.length} invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline text-green-600">
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-6 w-6" strokeWidth={3} />
                {customer.aggregates.total_paid}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Thank you!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline text-destructive">
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-6 w-6" strokeWidth={3} />
                {customer.aggregates.total_due}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">From outstanding invoices</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Email Address</span>
              <a href={`mailto:${customer.email}`} className="font-medium text-primary hover:underline">{customer.email}</a>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Phone Number</span>
              <a href={`tel:${customer.phone}`} className="font-medium text-primary hover:underline">{customer.phone}</a>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Billing Address</span>
              <span className="font-medium">{customer.address}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">GSTIN</span>
              <span className="font-mono text-sm">{customer.gst_number ?? '--'}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline">Invoice History</CardTitle>
                <CardDescription>A list of all invoices for {capitalizeWords(customer.name)}.</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href={`/dashboard/invoices/new?customerId=${customer.id}&from=/dashboard/customers/${customer.id}`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Invoice
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.aggregates.invoices.map((invoice) => (
                  <TableRow key={invoice.invoice_number}>
                    <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
                      {formatDate(invoice.due_date)}
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
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
                    <TableCell className="text-right cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
                      <div>
                        <span className="inline-flex items-center gap-0.5">
                          <IndianRupee className="h-3 w-3" />
                          {invoice.total_amount}
                        </span>
                      </div>
                      {invoice.status !== 'Paid' && (
                        <div className="text-xs text-muted-foreground">
                          Due:
                          <span className="inline-flex items-center gap-0.5">
                            <IndianRupee className="h-3 w-3" />
                            {invoice.due_amount}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => router.push(`/dashboard/invoices/${invoice.id}/edit?from=/dashboard/customers/${params.id}`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {invoice.status !== 'Paid' && (
                            <>
                              <DropdownMenuItem onSelect={() => handleMarkAsPaid(invoice.id)}>
                                <CircleDollarSign className="mr-2 h-4 w-4" />
                                Mark as Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleSendWhatsApp(invoice)}>
                                <WhatsAppIcon />
                                Send WhatsApp
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this invoice.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteInvoice(invoice.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {customer.aggregates.invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No invoices found for this customer.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
