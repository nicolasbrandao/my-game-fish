// File: middleware.ts
import { type NextRequest, NextResponse } from "next/server"

const AUTH_LOGIN_PATH = "/login"
const HOME = "/"

const PROTECTED_ROUTES_CONFIG = [
	{ path: HOME, exact: true },
	{ path: "/pro", exact: false },
	{ path: "/admin", exact: false },
]

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)"],
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const accessToken = request.cookies.get("access_token")?.value

	if (pathname === AUTH_LOGIN_PATH) {
		if (accessToken) {
			const redirectUrl = new URL(HOME, request.url)
			return NextResponse.redirect(redirectUrl)
		}

		return NextResponse.next()
	}

	let isAccessingProtectedPath = false
	for (const route of PROTECTED_ROUTES_CONFIG) {
		if (route.exact && pathname === route.path) {
			isAccessingProtectedPath = true
			break
		}
		if (!route.exact && pathname.startsWith(route.path)) {
			isAccessingProtectedPath = true
			break
		}
	}

	if (isAccessingProtectedPath) {
		if (!accessToken) {
			const loginUrl = new URL(AUTH_LOGIN_PATH, request.url)
			loginUrl.searchParams.set("redirectedFrom", pathname)
			return NextResponse.redirect(loginUrl)
		}

		return NextResponse.next()
	}

	return NextResponse.next()
}
