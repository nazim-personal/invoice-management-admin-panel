"use client";

import * as React from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {/* Stats cards */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Skeleton className="h-4 w-24" />
                            </CardTitle>
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-20 mb-2" />
                            <Skeleton className="h-3 w-28" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {/* Sales Performance Skeleton */}
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline">
                            <Skeleton className="h-5 w-40" />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-60" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="h-[300px] w-full rounded-md" />
                    </CardContent>
                </Card>

                {/* Recent Invoices Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">
                            <Skeleton className="h-5 w-40" />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-52" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[1, 2, 3, 4].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Skeleton className="h-4 w-32 mb-1" />
                                            <Skeleton className="h-3 w-24" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Skeleton className="h-4 w-16 mb-1 ml-auto" />
                                            <Skeleton className="h-3 w-12 ml-auto" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Skeleton className="h-5 w-16 ml-auto rounded-full" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <Button variant="ghost" size="sm" disabled>
                                <Skeleton className="h-4 w-16" />
                                <ArrowRight className="ml-2 h-4 w-4 opacity-40" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}