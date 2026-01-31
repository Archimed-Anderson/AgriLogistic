"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { UserRole, type User } from "@/types/auth"
import { 
  login as apiLogin, 
  register as apiRegister,
  forgotPassword as apiForgotPassword,
  storeTokens, 
  clearTokens, 
  getAccessToken 
} from "@/lib/api/auth"
import type { LoginFormData, RegisterFormData } from "@/lib/validation/auth-schemas"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

interface AuthContextValue extends AuthState {
  login: (data: LoginFormData) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  forgotPassword: (data: { email: string }) => Promise<void>
  devLogin: (role: UserRole) => void
  logout: () => void
  clearError: () => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

/**
 * Helper to get the correct dashboard path based on role
 */
function getDashboardPath(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin/dashboard"
    case UserRole.FARMER:
      return "/dashboard/agriculteur"
    case UserRole.BUYER:
      return "/dashboard/buyer"
    case UserRole.TRANSPORTER:
      return "/dashboard/transporter"
    default:
      return "/"
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [state, setState] = React.useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  // Initialize state from storage/cookies
  React.useEffect(() => {
    const initAuth = () => {
      if (typeof window === "undefined") return

      const token = getAccessToken()
      const storedRole = localStorage.getItem("userRole") as UserRole | null
      const storedUser = localStorage.getItem("userData")

      if (token && storedRole) {
        setState({
          user: storedUser ? JSON.parse(storedUser) : { id: "dev-id", email: "dev@AgriLogistic.com", role: storedRole },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } else {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    initAuth()
  }, [])

  const login = React.useCallback(async (data: LoginFormData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      // Simulation d'un délai réseau de 1 seconde pour le "Mode Démo" (Désactivé pour E2E compatibilité)
      // await new Promise(resolve => setTimeout(resolve, 1000))

      const response = await apiLogin(data.email, data.password)
      storeTokens(response.accessToken, response.refreshToken, response.user.role)
      
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role as UserRole,
        name: response.user.name
      }

      localStorage.setItem("userData", JSON.stringify(userData))
      
      setState({
        user: userData,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })

      router.push(getDashboardPath(userData.role))
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Erreur de connexion",
        isAuthenticated: false,
      }))
      throw err
    }
  }, [router])

  const register = React.useCallback(async (data: RegisterFormData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      // Simulation de latence pour l'inscription (Désactivé pour E2E compatibilité)
      // await new Promise(resolve => setTimeout(resolve, 1000))

      const response = await apiRegister(data.name, data.email, data.password, data.role)
      storeTokens(response.accessToken, response.refreshToken, response.user.role)
      
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role as UserRole,
        name: data.name
      }

      localStorage.setItem("userData", JSON.stringify(userData))

      setState({
        user: userData,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })

      router.push(getDashboardPath(userData.role))
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Erreur d'inscription",
        isAuthenticated: false,
      }))
      throw err
    }
  }, [router])

  const forgotPassword = React.useCallback(async (data: { email: string }) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      // // DEV ONLY: Simulation de latence
      await new Promise(resolve => setTimeout(resolve, 800))
      await apiForgotPassword(data.email)
      setState((prev) => ({ ...prev, isLoading: false }))
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Erreur lors de la demande de réinitialisation",
      }))
      throw err
    }
  }, [])

  /**
   * // DEV ONLY: Accès direct sans authentification réelle pour le mode test
   */
  const devLogin = React.useCallback((role: UserRole) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    
    // Simulate tokens
    const mockToken = `mock-token-${role}-${Date.now()}`
    storeTokens(mockToken, mockToken, role)
    
    const userData: User = {
      id: `dev-${role}`,
      email: `${role}@AgriLogistic.demo`,
      role: role,
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`
    }

    localStorage.setItem("userData", JSON.stringify(userData))

    // Short delay for UI feedback
    setTimeout(() => {
      setState({
        user: userData,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })
      router.push(getDashboardPath(role))
    }, 800)
  }, [router])

  const logout = React.useCallback(() => {
    clearTokens()
    localStorage.removeItem("userData")
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    })
    router.push("/login")
  }, [router])

  const clearError = React.useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, forgotPassword, devLogin, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


