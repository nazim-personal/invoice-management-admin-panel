"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { useToast } from "@/hooks/use-toast";
import { postRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { PaymentMethod } from "@/lib/types/payments";

interface PaymentFormProps {
    invoiceId: string;
    invoiceTotal: number;
    amountDue: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function PaymentForm({
    invoiceId,
    invoiceTotal,
    amountDue,
    open,
    onOpenChange,
    onSuccess,
}: PaymentFormProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        amount: amountDue.toString(),
        method: "cash" as PaymentMethod,
        reference_no: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid payment amount.",
                variant: "destructive",
            });
            return;
        }

        if (parseFloat(formData.amount) > amountDue) {
            toast({
                title: "Amount Exceeds Due",
                description: `Payment amount cannot exceed the due amount of ₹${amountDue}.`,
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await postRequest({
                url: `/api/invoices/${invoiceId}/pay`,
                body: {
                    amount: parseFloat(formData.amount),
                    method: formData.method,
                    reference_no: formData.reference_no || undefined,
                },
            });

            toast({
                title: "Payment Recorded",
                description: "Payment has been successfully recorded.",
                variant: "success",
            });

            onSuccess();
            onOpenChange(false);

            // Reset form
            setFormData({
                amount: amountDue.toString(),
                method: "cash",
                reference_no: "",
            });
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-headline">Record Payment</DialogTitle>
                    <DialogDescription>
                        Record a manual payment for this invoice. Amount due: ₹{amountDue.toFixed(2)}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount *</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData({ ...formData, amount: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="method">Payment Method *</Label>
                            <Select
                                value={formData.method}
                                onValueChange={(value: PaymentMethod) =>
                                    setFormData({ ...formData, method: value })
                                }
                            >
                                <SelectTrigger id="method">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reference_no">Reference Number</Label>
                            <Input
                                id="reference_no"
                                type="text"
                                placeholder="Optional reference number"
                                value={formData.reference_no}
                                onChange={(e) =>
                                    setFormData({ ...formData, reference_no: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Recording..." : "Record Payment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
