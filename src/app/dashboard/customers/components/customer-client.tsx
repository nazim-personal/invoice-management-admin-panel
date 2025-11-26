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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteRequest, getRequest } from "@/lib/helpers/axios/RequestService";
import { CustomerApiResponseTypes, CustomerDataTypes, DeletedResponse } from "@/lib/types/customers";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquareQuote,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomerForm } from "./customer-form";
import { InsightsDialog } from "./insights-dialog";
import { MetaTypes } from "@/lib/types/api";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { useDebounce } from "@/hooks/useDebounce";
import { CustomerSkeleton } from "./customer-skeleton";
import { capitalizeWords, formatDate } from "@/lib/helpers/forms";

export function CustomerClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerDataTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDataTypes | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("");
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<MetaTypes>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const debouncedFetch = useDebounce((query: string) => {
    getCustomers(query);
  }, 800);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    debouncedFetch(value);
  };

  const getCustomers = async (query?: string) => {
    setIsLoading(true);
    try {
      const response: CustomerApiResponseTypes<CustomerDataTypes[]> = await getRequest({
        url: "/api/customers",
        params: {
          page: currentPage,
          limit: rowsPerPage,
          q: query || undefined,
          status: activeTab !== "" ? activeTab : undefined,
        },
      });
      setCustomers(response.data.results || []);
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
    getCustomers();
  }, [currentPage, rowsPerPage, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSelectedCustomerIds([]);
  };

  const handleDelete = async (customerId: string) => {
    try {
      const deleteCustomers: CustomerApiResponseTypes<DeletedResponse> = await deleteRequest({
        url: "/api/customers",
        body: { ids: [customerId] },
      });
      toast({
        title: deleteCustomers.message,
        description: `${deleteCustomers.data.results.deleted_count} customer deleted.`,
        variant: "success",
      });
      setCustomers(customers.filter((customer) => customer.id !== customerId));
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
      const deleteCustomers: CustomerApiResponseTypes<DeletedResponse> = await deleteRequest({
        url: "/api/customers",
        body: { ids: selectedCustomerIds },
      });
      const deleted_count = deleteCustomers.data.results.deleted_count;
      toast({
        title: deleteCustomers.message,
        description: `${deleted_count} customer${deleted_count > 1 ? "s" : ""} deleted.`,
        variant: "success",
      });
      const remainingCustomers = customers.filter((c) => !selectedCustomerIds.includes(c.id ?? ""));
      setCustomers(remainingCustomers);
      setSelectedCustomerIds([]);
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

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const allCustomerIdsOnPage = customers.map((c) => c.id);
      setSelectedCustomerIds(Array.from(new Set([...selectedCustomerIds, ...allCustomerIdsOnPage])));
    } else {
      const pageCustomerIds = customers.map((c) => c.id);
      setSelectedCustomerIds(selectedCustomerIds.filter((id) => !pageCustomerIds.includes(id)));
    }
  };

  const handleSelectOne = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomerIds([...selectedCustomerIds, customerId]);
    } else {
      setSelectedCustomerIds(selectedCustomerIds.filter((id) => id !== customerId));
    }
  };

  const isAllOnPageSelected =
    customers.length > 0 && customers.every((c) => selectedCustomerIds.includes(c.id));
  const isSomeOnPageSelected =
    customers.length > 0 && customers.some((c) => selectedCustomerIds.includes(c.id));
  const selectAllCheckedState = isAllOnPageSelected
    ? true
    : isSomeOnPageSelected
    ? "indeterminate"
    : false;
  const totalPages = Math.ceil(meta.total / rowsPerPage);
  const startCustomer = customers.length > 0 ? (meta.page - 1) * rowsPerPage + 1 : 0;
  const endCustomer = Math.min(meta.page * rowsPerPage, meta.total);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleEdit = (customer: CustomerDataTypes) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleGetInsights = (customer: CustomerDataTypes) => {
    setSelectedCustomer(customer);
    setIsInsightsOpen(true);
  };

  const handleFormSave = (customer: CustomerDataTypes | null) => {
    setIsFormOpen(false);
    if (customer) {
      if (selectedCustomer) {
        setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
      } else {
        setCustomers([customer, ...customers]);
        setMeta((prev) => ({
          ...prev,
          total: prev.total + 1,
        }));
      }
    }
    setSelectedCustomer(null);
  };

  return (
    <>
      <Tabs defaultValue="" onValueChange={handleTabChange}>
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="">All</TabsTrigger>
            <TabsTrigger value="New">New</TabsTrigger>
            <TabsTrigger value="Pending">Pending</TabsTrigger>
            <TabsTrigger value="Paid">Paid</TabsTrigger>
            <TabsTrigger value="Overdue">Overdue</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {selectedCustomerIds.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedCustomerIds.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the selected customers and all their associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="w-full rounded-lg bg-background pl-10 md:w-[200px] lg:w-[336px]"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew} size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Customer</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-headline">
                    {selectedCustomer ? "Edit Customer" : "Add New Customer"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedCustomer
                      ? "Update the details of your customer."
                      : "Fill in the details to add a new customer."}
                  </DialogDescription>
                </DialogHeader>
                <CustomerForm customer={selectedCustomer} onSave={handleFormSave} />
              </DialogContent>
            </Dialog>
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
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Last Updated</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: rowsPerPage }).map((_, i) => <CustomerSkeleton key={i} />)
                  ) : customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="cursor-pointer"
                        data-state={selectedCustomerIds.includes(customer.id) ? "selected" : ""}
                      >
                        <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedCustomerIds.includes(customer.id)}
                            onCheckedChange={(checked) => handleSelectOne(customer.id, !!checked)}
                            aria-label="Select row"
                          />
                        </TableCell>
                        <TableCell
                          onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                        >
                          <div className="font-medium">{capitalizeWords(customer.name)}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </TableCell>
                        <TableCell
                          className="hidden md:table-cell"
                          onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                        >
                          {customer.phone}
                        </TableCell>
                        <TableCell
                          className="hidden sm:table-cell"
                          onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                        >
                          <Badge
                            variant={
                              customer.status === "Paid"
                                ? "default"
                                : customer.status === "New"
                                ? "outline"
                                : customer.status === "Pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="hidden md:table-cell"
                          onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                        >
                          {formatDate(customer.updated_at || customer.created_at)}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onSelect={() => router.push(`/dashboard/customers/${customer.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleEdit(customer)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleGetInsights(customer)}>
                                <MessageSquareQuote className="mr-2 h-4 w-4" />
                                Get AI Insights
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Customer
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this customer and all associated invoices.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(customer.id)}>
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="text-xs text-muted-foreground">
                  {selectedCustomerIds.length > 0
                    ? `${selectedCustomerIds.length} of ${customers.length} customer(s) selected.`
                    : `Showing ${startCustomer}-${endCustomer} of ${meta.total} customers`}
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
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {isInsightsOpen && selectedCustomer && (
        <InsightsDialog
          isOpen={isInsightsOpen}
          onOpenChange={setIsInsightsOpen}
          customer={selectedCustomer}
        />
      )}
    </>
  );
}
