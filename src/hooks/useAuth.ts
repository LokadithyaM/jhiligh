"use client"

import { useState, useEffect, useContext, createContext } from "react"

export interface AuthUser {
  id: string
  email: string
  name?: string
}

export interface AuthContextType {
  user: AuthUser | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => void
  loading: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }

    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Sign in failed")
      }

      const { user, token } = await response.json()

      setUser(user)
      setToken(token)
      localStorage.setItem("auth_token", token)
      localStorage.setItem("auth_user", JSON.stringify(user))
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Sign up failed")
      }

      const { user, token } = await response.json()

      setUser(user)
      setToken(token)
      localStorage.setItem("auth_token", token)
      localStorage.setItem("auth_user", JSON.stringify(user))
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signOut = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  return {
    user,
    signIn,
    signUp,
    signOut,
    loading,
    token,
  }
}

export { AuthContext }
