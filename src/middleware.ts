import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const BLINK_REVELUV_ONCE_SESSION = req.cookies.get("blink-reveluv-once-session"); // Prüft, ob ein Session-Cookie existiert

    if (!BLINK_REVELUV_ONCE_SESSION) {
        return NextResponse.redirect(new URL("/login", req.url)); // Falls keine Session -> Weiterleitung zum Login
    }

    return NextResponse.next(); // Falls Session existiert -> Zugriff auf Dashboard erlaubt
}

// Gilt nur für diese Routen:
export const config = {
    matcher: ["/dashboard/:path*"], // Middleware wird für `/dashboard` und Unterseiten aktiviert
};
