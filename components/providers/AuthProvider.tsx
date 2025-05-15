"use client"

import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"
import { type ReactNode, createContext, useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

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
			console.error({ error })
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

			if (!response.ok) {
				throw new Error(`Failed to logout. HTTP: ${response.status}`)
			}
		} catch (error) {
			let displayMessage = "An unexpected error occurred during logout."

			if (error instanceof Error) {
				displayMessage = error.message
			}

			toast.error(displayMessage)
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
