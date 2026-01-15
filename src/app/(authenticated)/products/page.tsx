
import { ProductClient } from "./components/product-client";

export default function ProductsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="page-header">
        <h1 className="page-title">
          Products
        </h1>
        <p className="page-description">
          Manage your products, stock, and prices.
        </p>
      </div>
      <ProductClient />
    </main>
  );
}
