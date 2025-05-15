import "@/app/globals.css";
import type { User } from "@/lib/types";
import { getInitialUserSessionOnServer } from "@/lib/utils/auth/getInitialUserSessionOnServer";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "../ui/sonner";
import { AuthProvider } from "./AuthProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export default async function UnifiedProvider({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const initialUser: User | null = await getInitialUserSessionOnServer()

	return (
		<html lang="en">
			<AuthProvider initialUser={initialUser}>
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<main>{children}</main>
					<Toaster />
				</body>
			</AuthProvider>
		</html>
	)
}
