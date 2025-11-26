"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export function useAuthGuard() {
  const { user, loading } = useAuthContext();  
  const router = useRouter();
  useEffect(() => {
    if (!loading && user === null) {
      router.replace("/");
    }
  }, [user, loading, router]);
}
