
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { ProductDataTypes, ProductDetailsApiResponseType } from "@/lib/types/products";
import {
  Barcode,
  Boxes,
  ChevronLeft,
  IndianRupee,
  Pencil
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import { ProductForm } from "../components/product-form";
import { ProductDetailsSkeleton } from "./skeleton";
import { formatWithThousands } from "@/lib/helpers/miscellaneous";

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = React.useState<ProductDataTypes>();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const getProduct = async (id: string) => {
    setIsLoading(true);
    try {
      const response: ProductDetailsApiResponseType = await getRequest({
        url: `/api/products/${id}`,
      });
      setProduct(response.data.results);
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

  useEffect(() => {
    getProduct(params.id as string);
  }, [params.id, router]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return <div className="text-center text-muted-foreground">Product not found.</div>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.push('/dashboard/products')}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          {product.name}
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0 capitalize">
          Product
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-headline">Edit Product</DialogTitle>
                <DialogDescription>
                  Update the details of your product.
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                product={product}
                onSave={async (updated) => {
                  if (updated) {
                    setProduct(updated);
                    await getProduct(updated.id);
                  }
                  setIsFormOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline text-destructive">
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-6 w-6" strokeWidth={3} />
                {formatWithThousands(product.price)}/unit
              </span>
            </div>
            <p className="text-xs text-muted-foreground">per unit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Stock</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline text-green-600">
              {product.stock} units
            </div>
            <p className="text-xs text-muted-foreground">Stock left in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Code</CardTitle>
            <Barcode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              {product.product_code}
            </div>
            <p className="text-xs text-muted-foreground">Stock Keeping Unit</p>
          </CardContent>
        </Card>

      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Product Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="font-medium">{product.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Product Code</span>
              <span className="font-medium">{product.product_code}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Description</span>
              <span className="font-medium">{product.description}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Price per unit</span>
              <span className="font-mono text-sm inline-flex items-center gap-0.5">
                <IndianRupee className="h-3 w-3" />
                {formatWithThousands(product.price)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline">Invoice History</CardTitle>
                <CardDescription>A list of all invoices for {product.product_code}.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {customer.aggregates.invoices.map((invoice) => (
                  <TableRow key={invoice.invoice_number}>
                    <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
                      {new Date(invoice.created_at).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
                      <Badge
                        variant={
                          invoice.status === "Paid"
                            ? "default"
                            : invoice.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="capitalize"
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
                      <div>₹{invoice.total_amount}</div>
                      {invoice.status !== 'Paid' && (
                        <div className="text-xs text-muted-foreground">
                          Due: ₹{invoice.due_amount}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => router.push(`/dashboard/invoices/${invoice.id}?from=/dashboard/customers/${params.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => router.push(`/dashboard/invoices/${invoice.id}/edit?from=/dashboard/customers/${params.id}`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {invoice.status !== 'Paid' && (
                            <>
                              <DropdownMenuItem onSelect={() => handleMarkAsPaid(invoice.id)}>
                                <CircleDollarSign className="mr-2 h-4 w-4" />
                                Mark as Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleSendWhatsApp(invoice)}>
                                <WhatsAppIcon />
                                Send WhatsApp
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this invoice.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteInvoice(invoice.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {customer.aggregates.invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No invoices found for this customer.
                    </TableCell>
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
