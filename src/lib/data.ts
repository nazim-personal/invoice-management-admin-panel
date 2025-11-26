
import type { Customer, Product, Invoice } from "./formTypes";

export const customers: Customer[] = [
  { id: "1", name: "Innovate Inc.", email: "contact@innovateinc.com", phone: "123-456-7890", address: "123 Tech Park, Silicon Valley, CA", gst_number: "29AABCU9567R1Z5", createdAt: new Date("2023-01-15") },
  { id: "2", name: "Quantum Solutions", email: "support@quantum.com", phone: "234-567-8901", address: "456 Future Ave, Metropolis, NY", gst_number: "07AABCS1234G1Z2", createdAt: new Date("2023-02-20") }
];

export const products: Product[] = [
  { id: "1", name: "Cloud Service Subscription", description: "1-year basic tier cloud service.", price: 1200, stock: 100 },
  { id: "2", name: "API Development", description: "Custom API integration service.", price: 5000, stock: 50 },
  { id: "3", name: "Website Maintenance", description: "Monthly website support package.", price: 300, stock: 200 }
];


export const invoices: Invoice[] = [
  { id: "1", invoiceNumber: "INV-001", customer: customers[0], items: [{ product: products[0], quantity: 1 }, { product: products[2], quantity: 3 }], date: new Date("2023-06-01"), subtotal: 2100, tax: 378, discount: 100, total: 2378, amountPaid: 2378, status: "Paid" },
  { id: "2", invoiceNumber: "INV-002", customer: customers[1], items: [{ product: products[1], quantity: 1 }], date: new Date("2023-06-05"), subtotal: 5000, tax: 900, discount: 0, total: 5900, amountPaid: 2000, status: "Pending" }
];
