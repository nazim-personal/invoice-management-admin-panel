"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserCreateForm } from "../components/user-create-form";
import { Can } from "@/components/Can";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserCreatePage() {
    const router = useRouter();

    return (
        <Can permission="users.create" fallback={<div className="p-8 text-center text-muted-foreground">You do not have permission to create users.</div>}>
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => router.push("/users")}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="text-xl font-semibold font-headline tracking-tight">
                        Create New User
                    </h1>
                </div>

                <UserCreateForm />
            </div>
        </Can>
    );
}
