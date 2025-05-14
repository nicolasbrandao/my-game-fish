import { cookies } from "next/headers";
import { User } from "@/lib/types";

export async function getInitialUserSessionOnServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    console.log('Initial session check (server): No access_token cookie found.');
    return null;
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    console.error("Backend URL is not configured for initial session check (server).");
    return null;
  }

  try {
    const response = await fetch(`${backendUrl}/auth/profile`, {
      headers: {
        'Cookie': `access_token=${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const userData: User = await response.json();
      console.log('Initial session check (server): User data fetched successfully.', userData.email);
      return userData;
    }

    if (response.status === 401) {
      console.log('Initial session check (server): No active session or token expired.');
    } else {
      console.error('Initial session check (server) failed:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Error during initial session check (server):', error);
  }
  return null;
}