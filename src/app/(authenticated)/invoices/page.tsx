
import { InvoiceClient } from "./components/invoice-client";

export default function InvoicesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="page-header">
        <h1 className="page-title">
          Invoices
        </h1>
        <p className="page-description">
          Create and manage your invoices.
        </p>
      </div>
      <InvoiceClient />
    </main>
  );
}
