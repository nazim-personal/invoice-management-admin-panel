"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ProductDataTypes, ProductsApiResponseTypes } from "@/lib/types/products";
import { useState } from "react";
import { cleanValues } from "@/lib/helpers/forms";
import { postRequest, putRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { ProductFormType } from "@/lib/formTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "").max(100, "Name must be 100 characters or less."),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less.")
    .optional(),
  price: z.coerce.number().positive(""),
});

export function ProductForm({
  product,
  onSave,
}: {
  product: ProductDataTypes | null;
  onSave: (product: ProductDataTypes | null) => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [stockAction, setStockAction] = useState<"increase" | "decrease">(
    "increase"
  );
  const [stockChange, setStockChange] = useState(0);
  const [stockError, setStockError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
    },
  });

  const currentStock = product?.stock || 0;
  const calculatedStock =
    stockAction === "increase"
      ? currentStock + stockChange
      : currentStock - stockChange;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (stockError) return;

    try {
      setLoading(true);
      const cleaned = cleanValues(values);

      let newStockQuantity = 0;

      if (product) {
        // --- Edit Mode ---
        newStockQuantity =
          stockAction === "increase"
            ? currentStock + stockChange
            : currentStock - stockChange;

        if (newStockQuantity < 0) {
          setLoading(false);
          return;
        }
      } else {
        // --- Add Mode ---
        newStockQuantity = stockChange;
      }

      const newOrUpdatedProduct: Partial<ProductFormType> = {
        ...cleaned,
        stock: newStockQuantity,
      };

      const savedProduct: ProductsApiResponseTypes<ProductDataTypes> = product
        ? await putRequest({
            url: `/api/products/${product.id}`,
            body: newOrUpdatedProduct,
          })
        : await postRequest({ url: "/api/products", body: newOrUpdatedProduct });

      toast({
        title: savedProduct.message,
        description: `${savedProduct.data.results.name} has been ${
          product ? "updated" : "created"
        }.`,
        variant: "success",
      });

      onSave(savedProduct.data.results);
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    onSave(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Cloud Service Subscription" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the product or service" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1200.00"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        field.onChange("");
                      } else {
                        const parsed = parseFloat(val);
                        if (!isNaN(parsed) && parsed >= 0) {
                          field.onChange(parsed);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      field.onChange(isNaN(val) ? 0 : val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock (Add Mode → Initial Stock, Edit Mode → Current Stock) */}
          {product ? (
            <FormItem>
              <FormLabel>Current Stock Quantity</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={
                    stockChange > 0
                      ? `${currentStock} ${
                          stockAction === "increase" ? "+" : "-"
                        } ${stockChange} = ${calculatedStock}`
                      : currentStock
                  }
                  disabled
                  className="font-mono text-center h-10"
                />
              </FormControl>
            </FormItem>
          ) : (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 100"
                  value={stockChange === 0 ? "" : stockChange}
                  onChange={(e) => {
                    const val = e.target.value;
                    const parsed = parseInt(val);
                    if (val === "" || isNaN(parsed) || parsed < 0) {
                      setStockChange(0);
                      return;
                    }
                    setStockChange(parsed);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        </div>

        {/* Action + New Stock (Edit Mode Only) */}
        {product && (
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>Action</FormLabel>
              <Select
                onValueChange={(value: "increase" | "decrease") => {
                  setStockAction(value);
                  if (value === "decrease" && stockChange > currentStock) {
                    setStockError("Quantity too high.");
                  } else {
                    setStockError(null);
                  }
                }}
                defaultValue={stockAction}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="increase">
                    <div className="flex items-center gap-2">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Increase Stock</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="decrease">
                    <div className="flex items-center gap-2">
                      <Minus className="h-3.5 w-3.5" />
                      <span>Decrease Stock</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>

            <FormItem>
              <FormLabel>New Stock Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 10"
                  value={stockChange === 0 ? "" : stockChange}
                  onChange={(e) => {
                    const val = e.target.value;
                    const parsed = parseInt(val);

                    if (val === "" || isNaN(parsed) || parsed < 0) {
                      setStockChange(0);
                      setStockError(null);
                      return;
                    }

                    setStockChange(parsed);

                    if (stockAction === "decrease" && parsed > currentStock) {
                      setStockError("Quantity too high.");
                    } else {
                      setStockError(null);
                    }
                  }}
                />
              </FormControl>
              {stockError && (
                <p className="text-sm font-medium text-destructive pt-1">
                  {stockError}
                </p>
              )}
            </FormItem>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Product
          </Button>
        </div>
      </form>
    </Form>
  );
}
