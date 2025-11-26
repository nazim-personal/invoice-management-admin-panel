
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Eye,
  Trash2,
  CircleDollarSign,
  IndianRupee,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceFormType } from "@/lib/formTypes";
import { useEffect, useState } from "react";
import { DeletedResponse, InvoiceApiResponseTypes, InvoiceDataTypes } from "@/lib/types/invoices";
import { MetaTypes } from "@/lib/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import { deleteRequest, getRequest, putRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { capitalizeWords, formatDate } from "@/lib/helpers/forms";
import { InvoiceSkeleton } from "./invoice-skeleton";
import { formatWithThousands } from "@/lib/helpers/miscellaneous";

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


export function InvoiceClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<InvoiceDataTypes[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<MetaTypes>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const debouncedFetch = useDebounce((query: string) => {
    getInvoices(query);
  }, 800);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    debouncedFetch(value);
  };

  const getInvoices = async (query?: string) => {
    setIsLoading(true);
    try {
      const response: InvoiceApiResponseTypes<InvoiceDataTypes[]> = await getRequest({
        url: "/api/invoices",
        params: {
          page: currentPage,
          limit: rowsPerPage,
          q: query || undefined,
          status: activeTab !== "" ? activeTab : undefined,
        },
      });
      setInvoices(response.data.results || []);
      setMeta(response.data.meta || { page: 1, limit: rowsPerPage, total: 0 });
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
    getInvoices();
  }, [currentPage, rowsPerPage, activeTab]);


  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSelectedInvoiceIds([]);
  }

  const handleMarkAsPaid = async (invoiceId: string) => {
    const currentInvoice = invoices.find((i) => i.id === invoiceId)
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
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
            ...inv,
            status: "Paid",
            due_amount: 0,
            amount_paid: currentInvoice?.total_amount, // keep consistency
          }
          : inv
      )
    );
  };


  const handleDelete = async (invoiceId: string) => {
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
      setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId));
      setMeta((prev) => {
        const newTotal = prev.total - 1;
        const newTotalPages = Math.ceil(newTotal / rowsPerPage);
        const newPage = currentPage > newTotalPages ? newTotalPages : currentPage;
        setCurrentPage(newPage > 0 ? newPage : 1);
        return { ...prev, total: newTotal };
      });
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const deleteInvoices: InvoiceApiResponseTypes<DeletedResponse> = await deleteRequest({
        url: "/api/invoices",
        body: { ids: selectedInvoiceIds },
      });
      const deleted_count = deleteInvoices.data.results.deleted_count;
      toast({
        title: deleteInvoices.message,
        description: `${deleted_count} invoice${deleted_count > 1 ? "s" : ""} deleted.`,
        variant: "success",
      });
      const remainingInvoices = invoices.filter((c) => !selectedInvoiceIds.includes(c.id ?? ""));
      setInvoices(remainingInvoices);
      setSelectedInvoiceIds([]);
      setMeta((prev) => {
        const newTotal = prev.total - deleted_count;
        const newTotalPages = Math.ceil(newTotal / rowsPerPage);
        const newPage = currentPage > newTotalPages ? newTotalPages : currentPage;
        setCurrentPage(newPage > 0 ? newPage : 1);
        return { ...prev, total: newTotal };
      });
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
    // const customer = invoice.customer;
    // if (!customer?.phone) {
    //   toast({
    //     title: "Customer phone number not available",
    //     description: `Could not send message for invoice ${invoice.invoiceNumber}.`,
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // const phoneNumber = customer.phone.replace(/[^0-9]/g, "");
    // const amountDue = invoice.total - invoice.amountPaid;
    // const message = `Hello ${customer.name},\n\nHere is your invoice ${invoice.invoiceNumber} for ₹${invoice.total}.\nAmount Due: ₹${amountDue}\n\nThank you for your business!`;
    // const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // window.open(whatsappUrl, "_blank");
  };

  const handleBulkSendWhatsApp = () => {
    const selectedInvoices = invoices.filter(invoice => selectedInvoiceIds.includes(invoice.id));
    if (selectedInvoices.length === 0) {
      toast({
        title: "No invoices selected",
        variant: "destructive",
      });
      return;
    }

    selectedInvoices.forEach(invoice => {
      if (invoice.status !== 'Paid') {
        handleSendWhatsApp(invoice);
      }
    });

    toast({
      title: "WhatsApp Messages Sent",
      description: `Opened WhatsApp for due invoices. Please check your browser tabs.`,
    });
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const allInvoiceIdsOnPage = invoices.map(c => c.id);
      setSelectedInvoiceIds(Array.from(new Set([...selectedInvoiceIds, ...allInvoiceIdsOnPage])));
    } else {
      const pageInvoiceIds = invoices.map(c => c.id);
      setSelectedInvoiceIds(selectedInvoiceIds.filter(id => !pageInvoiceIds.includes(id)));
    }
  }

  const handleSelectOne = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoiceIds([...selectedInvoiceIds, invoiceId]);
    } else {
      setSelectedInvoiceIds(selectedInvoiceIds.filter(id => id !== invoiceId));
    }
  }

  const isAllOnPageSelected = invoices.length > 0 && invoices.every(c => selectedInvoiceIds.includes(c.id));
  const isSomeOnPageSelected = invoices.length > 0 && invoices.some(c => selectedInvoiceIds.includes(c.id));
  const selectAllCheckedState = isAllOnPageSelected ? true : (isSomeOnPageSelected ? 'indeterminate' : false);
  const totalPages = Math.ceil(meta.total / rowsPerPage);
  const startInvoice = invoices.length > 0 ? (meta.page - 1) * rowsPerPage + 1 : 0;
  const endInvoice = Math.min(meta.page * rowsPerPage, meta.total);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  }

  return (
    <Tabs defaultValue="" onValueChange={handleTabChange} className="w-full">
      <div className="flex items-center justify-between gap-4">
        <TabsList>
          <TabsTrigger value="">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Paid">Paid</TabsTrigger>
          <TabsTrigger value="Overdue">Overdue</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {selectedInvoiceIds.length > 0 && (
            <>
              {(activeTab === 'Pending' || activeTab === 'Overdue' || activeTab === '') && (
                <Button variant="outline" size="sm" onClick={handleBulkSendWhatsApp}>
                  <WhatsAppIcon />
                  Send ({selectedInvoiceIds.length})
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedInvoiceIds.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the selected invoices.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="w-full rounded-lg bg-background pl-10 md:w-[200px] lg:w-[336px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button asChild size="sm" className="h-8 gap-1">
            <Link href="/dashboard/invoices/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Invoice
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value={activeTab}>
        <Card className="mt-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectAllCheckedState}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select All"
                    />
                  </TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: rowsPerPage }).map((_, i) => <InvoiceSkeleton key={i} />)
                ) : invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      data-state={selectedInvoiceIds.includes(invoice.id) ? "selected" : ""}
                    >
                      <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedInvoiceIds.includes(invoice.id)}
                          onCheckedChange={(checked) => handleSelectOne(invoice.id, !!checked)}
                          aria-label="Select row"
                        />
                      </TableCell>
                      <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}>
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}>
                        <div className="flex items-center">{capitalizeWords(invoice.customer.name)}</div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            {invoice.customer.phone}
                          </div>
                        </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}>
                        <div className="flex items-center"><IndianRupee className="h-3 w-3 mr-0" />{formatWithThousands(invoice.total_amount, true)}</div>
                        {invoice.status !== 'Paid' && (
                          <div className="text-xs text-muted-foreground flex items-center">
                            Due: <IndianRupee className="h-3 w-3 ml-1" />{formatWithThousands(invoice.due_amount, true)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}>
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
                      <TableCell className="hidden md:table-cell cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}>
                        {formatDate(invoice.updated_at || invoice.created_at)}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => router.push(`/dashboard/invoices/${invoice.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push(`/dashboard/invoices/${invoice.id}/edit`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {invoice.status !== 'Paid' && (
                              <>
                                <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); handleMarkAsPaid(invoice.id); }}>
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
                                  <AlertDialogAction onClick={() => handleDelete(invoice.id)}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-xs text-muted-foreground">
                {selectedInvoiceIds.length > 0
                  ? `${selectedInvoiceIds.length} of ${invoices.length} invoice(s) selected.`
                  : `Showing ${startInvoice}-${endInvoice} of ${meta.total} invoices`}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rows per page</span>
                  <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={String(rowsPerPage)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}