
import { InvoiceClient } from "./components/invoice-client";

export default function InvoicesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold font-headline tracking-tight">
          Invoices
        </h1>
        <p className="text-muted-foreground">
          Create and manage your invoices.
        </p>
      </div>
      <InvoiceClient />
    </main>
  );
}
