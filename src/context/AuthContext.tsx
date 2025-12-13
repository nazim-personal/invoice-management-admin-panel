'use client'

import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { getRequest, postRequest } from '@/lib/helpers/axios/RequestService'

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
  const { toast } = useToast()

  async function login(data: any) {
    setLoading(true)
    try {
      const resp = await postRequest({ url: '/api/auth/sign-in', body: data })

      // Assuming postRequest returns the data directly as per the new RequestService implementation plan
      // and the structure matches: { success: true, data: { results: { user: ... } } }
      // But wait, the RequestService returns `data` directly if success is true.
      // Let's verify the response structure from the requirements:
      // Response: { "success": true, "data": { "results": { "access_token": "...", "user": { ... } } } }

      // The current RequestService returns `data` (the whole JSON).
      // So resp will be the whole JSON object.

      if (resp.success && resp.user_info) {
        setUser(resp.user_info)
        toast({ title: 'Success', description: 'Login successful', variant: 'success' })
        router.push('/')
      } else {
        throw new Error('Invalid response structure')
      }

    } catch (error: any) {
      setUser(null)
      toast({ title: 'Error', description: error.message || 'Login failed', variant: 'destructive' })
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
      if (resp.success && resp.data) {
        setUser(resp.data)
      } else {
        // If /me fails or returns no user, we might be unauthenticated
        setUser(null)
      }
    } catch {
      setUser(null)
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
      router.replace('/')
    }
  }

  useEffect(() => {
    const publicPaths = ['/', '/forgot-password'];
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
