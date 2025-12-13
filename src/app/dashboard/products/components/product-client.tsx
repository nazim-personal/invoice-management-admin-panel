
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  IndianRupee,
} from "lucide-react";
import { ProductForm } from "./product-form";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { MetaTypes } from "@/lib/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductDataTypes, ProductsApiResponseTypes } from "@/lib/types/products";
import { getRequest, deleteRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { ProductSkeleton } from "./product-skeleton";
import { DeletedResponse } from "@/lib/types/customers";
import { capitalizeWords, formatDate } from "@/lib/helpers/forms";
import { formatWithThousands } from "@/lib/helpers/miscellaneous";
import { Can } from "@/components/Can";
import { Badge } from "@/components/ui/badge";

export function ProductClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductDataTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDataTypes | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [meta, setMeta] = useState<MetaTypes>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const debouncedFetch = useDebounce((query: string) => {
    getProducts(query);
  }, 800);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    debouncedFetch(value);
  };

  const getProducts = async (query?: string) => {
    setIsLoading(true);
    try {
      const response: ProductsApiResponseTypes<ProductDataTypes[]> = await getRequest({
        url: "/api/products",
        params: {
          page: currentPage,
          limit: rowsPerPage,
          q: query || undefined,
        },
      });
      setProducts(response.data.results || []);
      setMeta(response.data.meta || { page: 1, limit: rowsPerPage, total: 0 });
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
    getProducts();
  }, [currentPage, rowsPerPage]);

  const handleDelete = async (productId: string) => {
    try {
      const deleteCustomers: ProductsApiResponseTypes<DeletedResponse> = await deleteRequest({
        url: "/api/products",
        body: { ids: [productId] },
      });
      toast({
        title: deleteCustomers.message,
        description: `${deleteCustomers.data.results.deleted_count} product deleted.`,
        variant: "success",
      });
      setProducts(products.filter((product) => product.id !== productId));
      setMeta((prev) => {
        const newTotal = prev.total - 1;
        const newTotalPages = Math.ceil(newTotal / rowsPerPage);
        const newPage = currentPage > newTotalPages ? newTotalPages : currentPage;
        setCurrentPage(newPage > 0 ? newPage : 1);
        return { ...prev, total: newTotal };
      });
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const deleteCustomers: ProductsApiResponseTypes<DeletedResponse> = await deleteRequest({
        url: "/api/products",
        body: { ids: selectedProductIds },
      });
      const deleted_count = deleteCustomers.data.results.deleted_count;
      toast({
        title: deleteCustomers.message,
        description: `${deleted_count} product${deleted_count > 1 ? "s" : ""} deleted.`,
        variant: "success",
      });
      const remainingProducts = products.filter((p) => !selectedProductIds.includes(p.id ?? ""));
      setProducts(remainingProducts);
      setSelectedProductIds([]);
      setMeta((prev) => {
        const newTotal = prev.total - deleted_count;
        const newTotalPages = Math.ceil(newTotal / rowsPerPage);
        const newPage = currentPage > newTotalPages ? newTotalPages : currentPage;
        setCurrentPage(newPage > 0 ? newPage : 1);
        return { ...prev, total: newTotal };
      });
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    }
  }

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const allProductIdsOnPage = products.map(p => p.id);
      setSelectedProductIds(Array.from(new Set([...selectedProductIds, ...allProductIdsOnPage])));
    } else {
      const pageProductIds = products.map(p => p.id);
      setSelectedProductIds(selectedProductIds.filter(id => !pageProductIds.includes(id)));
    }
  }

  const handleSelectOne = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds([...selectedProductIds, productId]);
    } else {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    }
  }

  const isAllOnPageSelected = products.length > 0 && products.every(p => selectedProductIds.includes(p.id));
  const isSomeOnPageSelected = products.length > 0 && products.some(p => selectedProductIds.includes(p.id));
  const selectAllCheckedState = isAllOnPageSelected ? true : (isSomeOnPageSelected ? 'indeterminate' : false);
  const totalPages = Math.ceil(meta.total / rowsPerPage);
  const startProduct = products.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endProduct = Math.min(currentPage * rowsPerPage, meta.total);


  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  }
  const handleEdit = (product: ProductDataTypes) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleFormSave = (product: ProductDataTypes | null) => {
    setIsFormOpen(false);
    if (product) {
      if (selectedProduct) {
        setProducts(products.map((c) => (c.id === product.id ? product : c)));
      } else {
        setProducts([product, ...products]);
        setMeta((prev) => ({
          ...prev,
          total: prev.total + 1,
        }));
      }
    }
    setSelectedProduct(null);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold font-headline tracking-tight">Products</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="w-full rounded-lg bg-background pl-10 md:w-[200px] lg:w-[336px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {selectedProductIds.length > 0 && (
            <Can permission="products.delete">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedProductIds.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the selected products.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Can>
          )}
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <Can permission="products.create">
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} size="sm" className="h-8 gap-1">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Product
              </Button>
            </DialogTrigger>
          </Can>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline">
                {selectedProduct ? "Edit Product" : "Create Product"}
              </DialogTitle>
              <DialogDescription>
                {selectedProduct
                  ? "Make changes to the product here. Click save when you're done."
                  : "Add a new product to your inventory. Click save when you're done."}
              </DialogDescription>
            </DialogHeader>
            <ProductForm product={selectedProduct} onSave={handleFormSave} />
          </DialogContent>
        </Dialog>
      </div>
      <Can permission="products.list" fallback={<div className="p-8 text-center text-muted-foreground">You do not have permission to view products.</div>}>
        <Card className="mt-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectAllCheckedState}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select All"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: rowsPerPage }).map((_, i) => <ProductSkeleton key={i} />)
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow
                      key={product.id}
                      data-state={selectedProductIds.includes(product.id) ? "selected" : ""}
                    >
                      <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedProductIds.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectOne(product.id, !!checked)}
                          aria-label="Select row"
                        />
                      </TableCell>
                      <Can permission="products.view">
                        <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                          {product.name}
                        </TableCell>
                      </Can>
                      <Can permission="products.view">
                        <TableCell className="hidden md:table-cell max-w-xs truncate cursor-pointer" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                          {product.description || "-"}
                        </TableCell>
                      </Can>
                      <Can permission="products.view">
                        <TableCell className="cursor-pointer" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                          <div className="flex items-center"><IndianRupee className="h-3 w-3 mr-0" />{formatWithThousands(product.price, true)}</div>
                        </TableCell>
                      </Can>
                      <Can permission="products.view">
                        <TableCell className="cursor-pointer" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                          <Badge variant={product.stock > 10 ? "secondary" : "destructive"}>
                            {product.stock}
                          </Badge>
                        </TableCell>
                      </Can>
                      <Can permission="products.view">
                        <TableCell className="hidden md:table-cell cursor-pointer" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                          {formatDate(product.updated_at || product.created_at)}
                        </TableCell>
                      </Can>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Can permission="products.view">
                              <DropdownMenuItem onSelect={() => router.push(`/dashboard/products/${product.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </Can>
                            <Can permission="products.update">
                              <DropdownMenuItem onSelect={() => handleEdit(product)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                            </Can>
                            <Can permission="products.delete">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Product
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this product.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </Can>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between w-full border-t pt-4">
            <div className="text-xs text-muted-foreground">
              {selectedProductIds.length > 0
                ? `${selectedProductIds.length} of ${products.length} product(s) selected.`
                : `Showing ${startProduct}-${endProduct} of ${meta.total} products`}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Rows per page</span>
                <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={String(rowsPerPage)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Can>
    </>
  );
}
