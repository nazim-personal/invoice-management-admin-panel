"use client";

import * as React from "react";
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    IndianRupee,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PaymentDataTypes, PaymentsApiResponseTypes } from "@/lib/types/payments";
import { MetaTypes } from "@/lib/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { capitalizeWords, formatDate } from "@/lib/helpers/forms";
import { formatWithThousands } from "@/lib/helpers/miscellaneous";
import { Can } from "@/components/Can";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PaymentClient() {
    const router = useRouter();
    const { toast } = useToast();
    const [payments, setPayments] = React.useState<PaymentDataTypes[]>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = React.useState(true);
    const [meta, setMeta] = React.useState<MetaTypes>({
        page: 1,
        limit: 10,
        total: 0,
    });

    const debouncedFetch = useDebounce((query: string) => {
        getPayments(query);
    }, 800);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        debouncedFetch(value);
    };

    const getPayments = async (query?: string) => {
        setIsLoading(true);
        try {
            const response: PaymentsApiResponseTypes<PaymentDataTypes[]> = await getRequest({
                url: "/api/payments",
                params: {
                    page: currentPage,
                    limit: rowsPerPage,
                    q: query || undefined,
                },
            });
            setPayments(response.data.results || []);
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

    React.useEffect(() => {
        getPayments();
    }, [currentPage, rowsPerPage]);

    const totalPages = Math.max(Math.ceil(meta.total / rowsPerPage), 1);
    const startPayment = payments.length > 0 ? (meta.page - 1) * rowsPerPage + 1 : 0;
    const endPayment = Math.min(meta.page * rowsPerPage, meta.total);

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
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-xl font-semibold font-headline tracking-tight">Payments</h1>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search payments..."
                            className="w-full rounded-lg bg-background pl-10 md:w-[200px] lg:w-[336px]"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>
            <Can permission="payments.list" fallback={<div className="p-8 text-center text-muted-foreground">You do not have permission to view payments.</div>}>
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No payments found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-medium">
                                                {payment.invoice?.invoice_number || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {capitalizeWords(payment.customer?.name || "Unknown")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <IndianRupee className="h-3 w-3 mr-0" />
                                                    {formatWithThousands(payment.amount, true)}
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatDate(payment.payment_date)}</TableCell>
                                            <TableCell>{payment.method}</TableCell>
                                            <TableCell>{payment.reference_no || "-"}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <Can permission="invoices.view">
                                                            <DropdownMenuItem onSelect={() => router.push(`/invoices/${payment.invoice_id}`)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Invoice
                                                            </DropdownMenuItem>
                                                        </Can>
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
                                Showing {startPayment}-{endPayment} of {meta.total} payments
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
                                        disabled={currentPage >= totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        <span className="sr-only">Next page</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </Can>
        </div>
    );
}
