"use client";

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
import { useToast } from "@/hooks/use-toast";
import { CustomerFormType } from "@/lib/formTypes";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { postRequest, putRequest } from "@/lib/helpers/axios/RequestService";
import { cleanValues } from "@/lib/helpers/forms";
import { CustomerApiResponseTypes, CustomerDataTypes } from "@/lib/types/customers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "").max(50, "Name must be 50 characters or less."),
  email: z.string().email(""),
  phone: z.string()
    .min(10, "")
    .max(13, "")
    .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
  address: z.string().min(5, "").max(100, "Address must be 100 characters or less."),
  gst_number: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format")
    .optional()
    .or(z.literal('')),
});

interface IPropsTypes {
  customer: CustomerDataTypes | null
  onSave: (customer: CustomerDataTypes | null) => void
}
export function CustomerForm({ customer, onSave }: IPropsTypes) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      gst_number: customer?.gst_number || "",
    },
  });

  // Function to format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit and non-plus characters
    const cleaned = value.replace(/[^\d+]/g, '');

    // Ensure only one plus at the beginning
    if (cleaned.startsWith('+')) {
      const numbers = cleaned.slice(1).replace(/\D/g, '');
      return '+' + numbers;
    }

    return cleaned.replace(/\D/g, '');
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
    setLoading(true)
    const cleaned = cleanValues(values);
    const newOrUpdatedCustomer: Partial<CustomerFormType> = { ...cleaned };
      const savedCustomer: CustomerApiResponseTypes<CustomerDataTypes> = customer
        ? await putRequest({ url: `/api/customers/${customer.id}`, body: newOrUpdatedCustomer })
        : await postRequest({ url: "/api/customers", body: newOrUpdatedCustomer });
      toast({
        title: savedCustomer.message,
        description: `${savedCustomer.data.results.name} has been ${customer ? "updated" : "created"
          }.`,
        variant: "success"
      });

      onSave(savedCustomer.data.results);
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onSave(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  className={form.formState.errors.name ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...field}
                  className={form.formState.errors.email ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="+91 1234567890"
                  {...field}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    field.onChange(formatted);
                  }}
                  className={form.formState.errors.phone ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St, Anytown, USA"
                  {...field}
                  className={form.formState.errors.address ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gst_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GSTIN (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="29AABCU9567R1Z5"
                  {...field}
                  className={form.formState.errors.gst_number ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Customer</Button>
        </div>
      </form>
    </Form>
  );
}