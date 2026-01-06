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
                    <Card key={i} className={`animate-fade-in stagger-${i}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-24 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 animate-fade-in">
                {/* Sales Performance Skeleton */}
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full flex items-end justify-around gap-2 px-4">
                            {[40, 60, 45, 70, 55, 65].map((height, i) => (
                                <Skeleton
                                    key={i}
                                    className="w-full rounded-t-md"
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Invoices Skeleton */}
                <Card>
                    <CardHeader>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between py-2">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <Skeleton className="h-4 w-20 ml-auto" />
                                        <Skeleton className="h-5 w-16 ml-auto rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Skeleton className="h-9 w-24 rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}