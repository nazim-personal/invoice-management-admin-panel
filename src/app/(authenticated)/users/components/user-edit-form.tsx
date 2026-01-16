"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { UserDataTypes } from "@/lib/types/users";
import { putRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { PERMISSIONS, PERMISSION_CATEGORIES } from "@/lib/constants/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, User as UserIcon, CheckCircle2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

const formSchema = z.object({
    role: z.enum(["user", "admin", "staff", "manager"]),
    permissions: z.array(z.string()),
});

interface UserEditFormProps {
    user: UserDataTypes;
}

export function UserEditForm({ user }: UserEditFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { user: currentUser } = useAuthContext();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const currentUserPermissions = currentUser?.permissions || [];
    const isCurrentUserAdmin = currentUser?.role === "admin";

    const canGrantPermission = (permission: string) => {
        if (isCurrentUserAdmin) return true;
        return currentUserPermissions.includes(permission);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: user.role || "user",
            permissions: user.permissions || [],
        },
    });

    // Reset form when user data changes to ensure preselection works correctly
    React.useEffect(() => {
        if (user) {
            form.reset({
                role: user.role || "user",
                permissions: Array.isArray(user.permissions) ? user.permissions : [],
            });
        }
    }, [user, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await putRequest({
                url: `/api/users/${user.id}`,
                body: values,
            });
            toast({
                title: "Success",
                description: "User updated successfully.",
                variant: "success",
            });
            router.push("/users");
            router.refresh();
        } catch (err: any) {
            const parsed = handleApiError(err);
            toast({
                title: parsed.title,
                description: parsed.description,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const toggleAllInCategory = (category: string, checked: boolean) => {
        const categoryPermissions = PERMISSION_CATEGORIES[category];
        const currentPermissions = form.getValues("permissions");

        let newPermissions: string[];
        if (checked) {
            // Add all permissions from this category that aren't already there
            newPermissions = [...new Set([...currentPermissions, ...categoryPermissions])];
        } else {
            // Remove all permissions from this category
            newPermissions = currentPermissions.filter(p => !categoryPermissions.includes(p));
        }

        form.setValue("permissions", newPermissions, { shouldValidate: true, shouldDirty: true });
    };

    const isCategoryFullySelected = (category: string) => {
        const categoryPermissions = PERMISSION_CATEGORIES[category];
        const currentPermissions = form.getValues("permissions");
        return categoryPermissions.every(p => currentPermissions.includes(p));
    };

    const canSelectAllInCategory = (category: string) => {
        if (isCurrentUserAdmin) return true;
        const categoryPermissions = PERMISSION_CATEGORIES[category];
        return categoryPermissions.every(p => currentUserPermissions.includes(p));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Role Management
                        </CardTitle>
                        <CardDescription>
                            Assign a system role to {user.name}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="max-w-md">
                                    <FormLabel>User Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Administrators have full access to all system features.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Permissions
                        </CardTitle>
                        <CardDescription>
                            Select specific permissions for this user. These only apply if the user is not an Administrator.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => (
                            <div key={category} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-foreground">{category}</h3>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => toggleAllInCategory(category, !isCategoryFullySelected(category))}
                                        disabled={!canSelectAllInCategory(category)}
                                    >
                                        {isCategoryFullySelected(category) ? "Deselect All" : "Select All"}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {perms.map((permission) => (
                                        <FormField
                                            key={permission}
                                            control={form.control}
                                            name="permissions"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={permission}
                                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(permission)}
                                                                disabled={!canGrantPermission(permission)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, permission])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== permission
                                                                            )
                                                                        );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="text-sm font-medium">
                                                                {PERMISSIONS[permission] || permission}
                                                            </FormLabel>
                                                            <FormDescription className="text-[10px]">
                                                                {permission}
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                <Separator className="mt-4" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/users")}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
