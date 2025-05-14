import type { User } from "@/lib/types"
import { cookies } from "next/headers"

export async function getInitialUserSessionOnServer(): Promise<User | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get("access_token")?.value

	if (!token) {
		return null
	}

	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
	if (!backendUrl) {
		return null
	}

	const response = await fetch(`${backendUrl}/auth/profile`, {
		headers: {
			Cookie: `access_token=${token}`,
			"Content-Type": "application/json",
		},
		cache: "no-store",
	})

	if (response.ok) {
		const userData: User = await response.json()
		return userData
	}

	return null
}
