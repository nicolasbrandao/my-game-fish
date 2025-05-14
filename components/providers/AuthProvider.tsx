"use client"

import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react"

interface AuthContextType {
	user: User | null
	isLoading: boolean
	login: () => void
	logout: () => Promise<void>
	checkSession: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
	initialUser: User | null
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(initialUser)
	const [isLoading, setIsLoading] = useState<boolean>(initialUser === null)
	const router = useRouter()

	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

	const checkSession = useCallback(async () => {
		if (!backendUrl) {
			setUser(null)
			setIsLoading(false)
			return
		}
		setIsLoading(true)
		try {
			const response = await fetch(`${backendUrl}/auth/profile`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			})

			if (response.ok) {
				const userData = await response.json()
				setUser(userData)
			} else {
				setUser(null)
			}
		} catch (error) {
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}, [backendUrl])

	useEffect(() => {
		if (initialUser === null) {
			checkSession()
		}
	}, [checkSession, initialUser])

	const login = () => {
		if (!backendUrl) {
			return
		}
		window.location.href = `${backendUrl}/auth/google`
	}

	const logout = async () => {
		if (!backendUrl) {
			return
		}
		setIsLoading(true)
		try {
			const response = await fetch(`${backendUrl}/auth/logout`, {
				method: "POST",
				credentials: "include",
			})
			if (response.ok) {
				setUser(null)
				router.push("/login")
			} else {
				setUser(null)
				router.push("/login")
			}
		} catch (error) {
			setUser(null)
			router.push("/login")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
			{children}
		</AuthContext.Provider>
	)
}
