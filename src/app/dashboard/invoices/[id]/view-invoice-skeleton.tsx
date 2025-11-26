"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ViewInvoiceSkeleton() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-6 w-20 ml-auto" />
      </div>

      {/* Invoice Card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>
              <Skeleton className="h-8 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-40 mt-1" />
            </CardDescription>
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </CardHeader>

        <CardContent>
          {/* Customer & QR Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex justify-end md:justify-start">
              <Skeleton className="h-28 w-28" />
            </div>
          </div>

          {/* Items Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-4 w-16" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-end">
          <div className="w-full max-w-sm space-y-2">
            {[...Array(5)].map((_, idx) => (
              <Skeleton key={idx} className="h-4 w-full" />
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Mobile Buttons */}
      <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </main>
  );
}
