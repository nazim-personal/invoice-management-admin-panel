// Example usage of EmptyState component

import { EmptyState } from "@/components/ui/empty-state"
import { FileText, Users, Package, CreditCard } from "lucide-react"

// Example 1: Empty Invoices
export function EmptyInvoices() {
    return (
        <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No invoices yet"
            description="Get started by creating your first invoice. Track payments and manage your billing effortlessly."
            action={{
                label: "Create Invoice",
                onClick: () => {
                    // Handle create invoice
                },
            }}
        />
    )
}

// Example 2: Empty Customers
export function EmptyCustomers() {
    return (
        <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No customers found"
            description="Add your first customer to start managing your client relationships and invoices."
            action={{
                label: "Add Customer",
                onClick: () => {
                    // Handle add customer
                },
            }}
        />
    )
}

// Example 3: Empty Products
export function EmptyProducts() {
    return (
        <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No products available"
            description="Create your product catalog to streamline invoice creation and inventory management."
            action={{
                label: "Add Product",
                onClick: () => {
                    // Handle add product
                },
            }}
        />
    )
}

// Example 4: Empty Payments
export function EmptyPayments() {
    return (
        <EmptyState
            icon={<CreditCard className="h-12 w-12" />}
            title="No payments recorded"
            description="Once you receive payments, they will appear here for easy tracking and reconciliation."
        />
    )
}

// Example 5: Search Results Empty
export function EmptySearchResults() {
    return (
        <EmptyState
            title="No results found"
            description="Try adjusting your search terms or filters to find what you're looking for."
            className="py-8"
        />
    )
}
