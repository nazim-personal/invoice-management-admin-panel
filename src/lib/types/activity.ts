export type ActivityType =  "Invoice" | "Customer" | "Payment" | "Product";

export interface Activity {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    created_at: string;
    variant: "default" | "secondary" | "outline";
}
