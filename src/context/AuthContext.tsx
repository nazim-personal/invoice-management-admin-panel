'use client'

import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { getRequest, postRequest } from '@/lib/helpers/axios/RequestService'
import { handleApiError } from '@/lib/helpers/axios/errorHandler'

type User = {
  id: string
  email: string
  username: string
  name: string
  role: string
  permissions: string[]
} | null

interface AuthContextProps {
  user: User
  setUser: Dispatch<SetStateAction<User>>
  login: (data: any) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  async function login(data: any) {
    setLoading(true)
    try {
      const resp = await postRequest({ url: '/api/auth/sign-in', body: data })

      if (resp.success) {
        if (resp.user_info) {
          setUser(resp.user_info)
        } else {
          // If user_info is missing, try to fetch it
          await refreshUser()
        }
        toast({ title: 'Success', description: resp.message || 'Login successful', variant: 'success' })
        router.push('/dashboard')
      } else {
        throw new Error('Invalid response structure')
      }

    } catch (error: any) {
      setUser(null)
      const { title, description } = handleApiError(error)
      toast({ title, description, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function refreshUser() {
    try {
      // We need a way to check if we are logged in.
      // Usually /api/users/me or similar.
      // The requirements say: "Store the user object and permissions array globally."
      // And "Interceptor: ... call POST /api/auth/refresh to get a new access token"

      // Let's assume /api/users/me returns the user profile.
      const resp = await getRequest({ url: '/api/users/me' })

      // Fix: The /api/users/me endpoint returns { authenticated: boolean, user_info: User }
      // It does NOT return { success: true, data: User } like other APIs might.
      if (resp.authenticated && resp.user_info) {
        setUser(resp.user_info)
      } else if (resp.success && resp.data) {
        // Fallback for standard API structure if it changes
        setUser(resp.data)
      } else {
        // If /me fails or returns no user, we might be unauthenticated
        setUser(null)
      }
    } catch (error: any) {
      // Only set user to null if it's a 401 or specific auth error
      // If it's a 500 (server error), we might want to keep the user logged in (if they were)
      // or at least not force a redirect immediately if we can avoid it.
      // However, on initial load, if we can't verify the user, we can't let them in.
      // But if this is a re-validation, maybe we can be more lenient?
      // For now, let's assume if status is NOT 401, we don't logout.
      if (error?.response?.status === 401) {
        setUser(null)
      } else {
        // Log error but don't logout for 500s to avoid redirect loops or bad UX on server hiccups
        console.error("Failed to refresh user:", error);
        // If we don't set user(null), loading stays true? No, finally sets loading false.
        // If loading is false and user is null (default), it will redirect.
        // So we need to decide: if 500, do we let them in? No, we don't have user data.
        // We can't let them in without user data.
        // So strictly speaking, if /me fails, we can't authenticate.
        // BUT, if the user was ALREADY logged in (persisted), we might use that?
        // We don't persist user in localStorage in this code.

        // So for initial load, 500 means we can't load.
        // But the user's issue is likely about the DASHBOARD API 500.
        // I've fixed the Dashboard page. I will leave this strictly safe for now.
        setUser(null);
      }
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await postRequest({ url: "/api/auth/sign-out", body: {} });
      toast({ title: 'Success', description: 'Sign-out successful', variant: 'success' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setUser(null)
      // Manually clear cookie on client side as well to be safe
      document.cookie = "user_details=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.replace('/')
    }
  }

  useEffect(() => {
    const publicPaths = ['/', '/forgot-password'];

    // Try to load user from cookie first for instant UI
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )user_details=([^;]+)'));
      if (match) {
        try {
          const userDetails = JSON.parse(decodeURIComponent(match[2]));
          setUser(userDetails);
          setLoading(false); // Optimistic load
        } catch (e) {
          console.error("Failed to parse user_details cookie", e);
        }
      }
    }

    if (!publicPaths.includes(window.location.pathname)) {
      refreshUser()
    } else {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  // Protect routes
  useEffect(() => {
    const publicPaths = ['/', '/forgot-password'];
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push('/');
    }
  }, [user, loading, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
