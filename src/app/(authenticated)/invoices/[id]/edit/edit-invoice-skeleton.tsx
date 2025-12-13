"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function EditInvoiceSkeleton() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-20 ml-auto" />
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        {/* Left section: Customers + Products */}
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          {/* Customers Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[...Array(5)].map((_, idx) => (
                <Skeleton key={idx} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>

          {/* Products Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 items-center">
                  <Skeleton className="h-4 w-full col-span-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right section: Summary Card */}
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[...Array(7)].map((_, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Mobile Buttons */}
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </main>
  );
}
