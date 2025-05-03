import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = ["/sign-in", "/sign-up", "/reset-password", '/', '/about', '/pricing'];
export async function middleware(request: NextRequest) {
    
    const sessionCookie = getSessionCookie(request);
    const currentUrl = new URL(request.url);
	if (!sessionCookie && !publicRoutes.includes(currentUrl.pathname)) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
	matcher: ["/dashboard"], // Specify the routes the middleware applies to
};