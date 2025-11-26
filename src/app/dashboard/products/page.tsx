import { products } from "@/lib/data";
import { ProductClient } from "./components/product-client";

export default function ProductsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold font-headline tracking-tight">
          Products
        </h1>
        <p className="text-muted-foreground">
          Manage your products, stock, and prices.
        </p>
      </div>
      <ProductClient />
    </main>
  );
}
