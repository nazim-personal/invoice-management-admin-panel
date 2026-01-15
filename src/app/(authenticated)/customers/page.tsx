import { CustomerClient } from "./components/customer-client";

export default async function CustomersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="page-header">
        <h1 className="page-title">
          Customers
        </h1>
        <p className="page-description">
          Manage your customers and view their details.
        </p>
      </div>
      <CustomerClient />
    </main>
  );
}
