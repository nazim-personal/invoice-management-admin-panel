
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { postRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";

const formSchema = z.object({
  identifier: z.string().min(1, { message: "Identifier is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = await postRequest({ url: "/api/auth/sign-in", body: values });
      setUser(data.user_info);
      toast({
        title: data?.message,
        description: `Welcome back ${data.user_info.name}!`,
        variant: "success",
      });
      router.push("/dashboard");
    } catch (error: any) {      
      const errorHandler = handleApiError(error);
      toast({
        title: errorHandler.title,
        description: errorHandler.description,
        variant: "destructive",
      });
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome to Invoice Pilot</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="Enter username or email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} {...field} />
                        <div
                          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
