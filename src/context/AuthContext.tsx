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
      const resp = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!resp.ok) {
        const errorData = await resp.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const userData = await resp.json()
      setUser(userData.user)
      toast({ title: 'Success', description: 'Login successful', variant: 'success' })
      router.push('/')
    } catch (error: any) {
      setUser(null)
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function refreshUser() {
    try {
      const resp = await getRequest({url: '/api/users/me'})      
      if (!resp.authenticated) throw new Error('Unauthorized')
      setUser(resp.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await postRequest({url: "/api/auth/sign-out", body: {}});
      toast({ title: 'Success', description: 'Sign-out successful', variant: 'success' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setUser(null)
      router.replace('/')
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

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
