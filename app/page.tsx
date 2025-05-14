"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
	const { user, isLoading, logout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !user) {
			router.push("/login");
		}
	}, [user, isLoading, router]);

	if (isLoading || !user) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<p>Loading session...</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Welcome to the App</h1>
				<Button onClick={logout} variant="outline">
					Logout
				</Button>
			</div>

			<div className="bg-card p-6 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold mb-2">User Profile</h2>
				{user.displayName && (
					<p>
						<strong>Name:</strong> {user.displayName}
					</p>
				)}
				<p>
					<strong>Email:</strong> {user.email}
				</p>
				<p>
					<strong>User ID:</strong> {user.id}
				</p>
				<p>
					<strong>Joined:</strong>{" "}
					{new Date(user.createdAt).toLocaleDateString()}
				</p>
			</div>
		</div>
	);
}
