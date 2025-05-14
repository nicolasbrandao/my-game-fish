import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import type { User } from "@/lib/types";
import { getInitialUserSessionOnServer } from "@/lib/utils/auth/getInitialUserSessionOnServer";
import { cookies } from "next/headers";
import { Toaster } from "../ui/sonner";
import { AuthProvider } from "./AuthProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function getInitialUserSession(): Promise<User | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("access_token")?.value;

	if (!token) {
		return null;
	}

	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
	if (!backendUrl) {
		console.error("Backend URL is not configured for initial session check.");
		return null;
	}

	try {
		const response = await fetch(`${backendUrl}/auth/profile`, {
			headers: {
				Cookie: `access_token=${token}`,
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});

		if (response.ok) {
			const userData: User = await response.json();
			return userData;
		}

		if (response.status === 401) {
			console.log("Initial session check: No active session or token expired.");
		} else {
			console.error(
				"Initial session check failed:",
				response.status,
				await response.text(),
			);
		}
	} catch (error) {
		console.error("Error during initial session check:", error);
	}
	return null;
}

export default async function UnifiedProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialUser: User | null = await getInitialUserSessionOnServer();

	return (
		<html lang="en">
			<AuthProvider initialUser={initialUser}>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<main>{children}</main>
					<Toaster />
				</body>
			</AuthProvider>
		</html>
	);
}
