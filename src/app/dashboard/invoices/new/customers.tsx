
"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { capitalizeWords } from "@/lib/helpers/forms";
import { MetaTypes } from "@/lib/types/api";
import { CustomerApiResponseTypes, CustomerDataTypes } from "@/lib/types/customers";
import {
    UserPlus
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { CustomerForm } from "../../customers/components/customer-form";

interface IPropsTypes {
    customers: CustomerDataTypes[]
    setCustomers: React.Dispatch<React.SetStateAction<CustomerDataTypes[]>>
    selectedCustomerId: string | null
    setSelectedCustomerId: React.Dispatch<React.SetStateAction<string | null>>
    invoice_number?: string
    isDisabled?: boolean
}
export default function CustomersInvoice({ customers, setCustomers, selectedCustomerId, setSelectedCustomerId, invoice_number, isDisabled = false }: IPropsTypes) {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const customerIdFromQuery = searchParams.get("customerId");

    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState<MetaTypes>({
        page: 1,
        limit: 10,
        total: 0,
    });
console.log('customers: ', JSON.stringify(customers));
console.log('selectedCustomerId: ', selectedCustomerId);

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
                    limit: meta.limit,
                    q: query || undefined,
                },
            });
            setCustomers(prev => (currentPage === 1 || (query != null && query?.length > 0)) ? (response.data.results || []) : [...prev, ...(response.data.results || [])]);
            setMeta(response.data.meta || { page: 1, limit: meta.limit, total: 0 });
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
    }, [currentPage]);

    const handleLoadMoreCustomers = () => {
        if (customers.length < meta.total) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
        }
    };
    const handleCustomerSave = async (newCustomer: CustomerDataTypes | null) => {
        setIsFormOpen(false);
        if (newCustomer) {
            // In a real app, you would also save this to your database
            const updatedCustomers = [newCustomer, ...customers];
            setCustomers([newCustomer, ...customers]);
            setSelectedCustomerId(newCustomer.id ?? '');
            toast({
                title: "Customer Saved",
                description: `The ${newCustomer.name} customer has been created and selected.`,
                variant: 'success'
            });
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="customer">Customer</Label>
                        <div className="flex items-center gap-2">
                            <Select value={selectedCustomerId || ""} onValueChange={setSelectedCustomerId} disabled={!!customerIdFromQuery || isDisabled}>
                                <SelectTrigger id="customer" aria-label="Select customer">
                                    <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="p-2">
                                        <Input
                                            placeholder="Search customers..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    {isLoading ? (
                                        <div className="space-y-2 p-2">
                                            {[...Array(meta.limit)].map((_, i) => (
                                                <Skeleton key={i} className="h-8 w-full rounded-md" />
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            {customers.length > 0 ? (
                                                customers.map((customer) => (
                                                    <SelectItem key={customer.id} value={customer.id}>
                                                        {capitalizeWords(customer.name)}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground space-y-2">
                                                    <div className="flex justify-center">
                                                        <UserPlus className="h-8 w-8 text-muted-foreground/60" />
                                                    </div>
                                                    <p>No customers found</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setIsFormOpen(true)}
                                                        className="mt-2"
                                                    >
                                                        <UserPlus className="h-4 w-4 mr-1" /> Add New Customer
                                                    </Button>
                                                </div>
                                            )}

                                            {customers.length < meta.total && customers.length > 0 && (
                                                <div className="flex items-center justify-center p-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleLoadMoreCustomers}
                                                        disabled={isLoading}
                                                        className="w-full"
                                                    >
                                                        {isLoading ? "Loading..." : "Load more customers"}
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    )}

                                </SelectContent>
                            </Select>
                            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" disabled={isDisabled}>
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="font-headline">Add New Customer</DialogTitle>
                                        <DialogDescription>
                                            Fill in the details to add a new customer.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <CustomerForm customer={null} onSave={handleCustomerSave} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    {
                        invoice_number && (
                            <div className="grid gap-3">
                                <Label>Invoice Number</Label>
                                <Input defaultValue={invoice_number} disabled />
                            </div>
                        )
                    }
                </div>
            </CardContent>
        </Card>
    );
}

