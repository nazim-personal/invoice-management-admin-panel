"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { InvoiceDetailsApiResponseType } from "@/lib/types/invoices";

export default function PaymentRedirectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"checking" | "success" | "failed" | "pending">("checking");
    const [invoiceId, setInvoiceId] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);
    const maxPolls = 10; // Poll for up to 30 seconds (10 polls * 3 seconds)

    useEffect(() => {
        // Get invoice ID from URL params
        const id = searchParams.get("invoice_id");
        if (id) {
            setInvoiceId(id);
            checkPaymentStatus(id);
        } else {
            setStatus("failed");
        }
    }, [searchParams]);

    const checkPaymentStatus = async (id: string) => {
        try {
            const response: InvoiceDetailsApiResponseType = await getRequest({
                url: `/api/invoices/${id}`,
            });

            const invoice = response.data.results;

            if (invoice.status === "Paid") {
                setStatus("success");
            } else if (pollCount < maxPolls) {
                // Continue polling
                setPollCount(prev => prev + 1);
                setTimeout(() => checkPaymentStatus(id), 3000); // Poll every 3 seconds
            } else {
                // Max polls reached, payment might still be processing
                setStatus("pending");
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
            if (pollCount < maxPolls) {
                setPollCount(prev => prev + 1);
                setTimeout(() => checkPaymentStatus(id), 3000);
            } else {
                setStatus("failed");
            }
        }
    };

    const handleViewInvoice = () => {
        if (invoiceId) {
            router.push(`/invoices/${invoiceId}`);
        }
    };

    const handleBackToInvoices = () => {
        router.push("/invoices");
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        {status === "checking" && (
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        )}
                        {status === "success" && (
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                        )}
                        {status === "failed" && (
                            <XCircle className="h-16 w-16 text-destructive" />
                        )}
                        {status === "pending" && (
                            <AlertCircle className="h-16 w-16 text-yellow-600" />
                        )}
                    </div>
                    <CardTitle className="font-headline text-2xl">
                        {status === "checking" && "Verifying Payment..."}
                        {status === "success" && "Payment Successful!"}
                        {status === "failed" && "Payment Verification Failed"}
                        {status === "pending" && "Payment Processing"}
                    </CardTitle>
                    <CardDescription>
                        {status === "checking" && (
                            <>
                                Please wait while we verify your payment with PhonePe.
                                <br />
                                <span className="text-xs text-muted-foreground">
                                    Poll attempt: {pollCount + 1}/{maxPolls}
                                </span>
                            </>
                        )}
                        {status === "success" && "Your payment has been successfully processed and recorded."}
                        {status === "failed" && "We couldn't verify your payment. Please contact support if you were charged."}
                        {status === "pending" && "Your payment is being processed. This may take a few minutes. You can check the invoice status later."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {invoiceId && (
                        <Button
                            className="w-full"
                            onClick={handleViewInvoice}
                            variant={status === "success" ? "default" : "outline"}
                        >
                            View Invoice
                        </Button>
                    )}
                    <Button
                        className="w-full"
                        onClick={handleBackToInvoices}
                        variant="outline"
                    >
                        Back to Invoices
                    </Button>

                    {status === "pending" && (
                        <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                            <p className="font-medium">Payment is still processing</p>
                            <p className="mt-1 text-xs">
                                The webhook may take a few moments to update the invoice status.
                                You can safely close this page and check the invoice later.
                            </p>
                        </div>
                    )}

                    {status === "checking" && (
                        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                            <p className="font-medium">Checking payment status...</p>
                            <p className="mt-1 text-xs">
                                We're polling the backend to verify if the PhonePe webhook has updated the payment status.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
