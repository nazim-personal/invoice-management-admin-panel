"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { UserEditForm } from "../../components/user-edit-form";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { useToast } from "@/hooks/use-toast";
import { UserApiResponseTypes, UserDataTypes } from "@/lib/types/users";
import { Can } from "@/components/Can";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserEditPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = React.useState<UserDataTypes | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response: UserApiResponseTypes<UserDataTypes> = await getRequest({
                    url: `/api/users/${params.id}`,
                });
                setUser(response.data.results || response.data);
            } catch (err: any) {
                const parsed = handleApiError(err);
                toast({
                    title: parsed.title,
                    description: parsed.description,
                    variant: "destructive",
                });
                router.push("/users");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchUser();
        }
    }, [params.id, router, toast]);

    return (
        <Can permission="users.update" fallback={<div className="p-8 text-center text-muted-foreground">You do not have permission to edit users.</div>}>
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
                        Edit User: {isLoading ? <Skeleton className="h-6 w-32 inline-block" /> : user?.name}
                    </h1>
                </div>

                {isLoading ? (
                    <div className="space-y-8">
                        <Skeleton className="h-[200px] w-full" />
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                ) : user ? (
                    <UserEditForm user={user} />
                ) : (
                    <div className="text-center p-8 text-muted-foreground">
                        User not found.
                    </div>
                )}
            </div>
        </Can>
    );
}
