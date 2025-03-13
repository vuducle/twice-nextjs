"use client"
import { useRouter, usePathname } from "next/navigation";
import Login from "@/app/login/page";
import Register from "@/app/register/page";

export default function Home() {
    // const router = useRouter();
    const pathname = usePathname()

    return (
        <div className="hero min-h-screen">
            <video width="100%" height="100%" loop playsInline muted autoPlay preload="none">
                <source src="/videos/twice.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">OnceVerse</h1>
                    <p className="mb-5">
                        {pathname === "/login" && "Login to your account"}
                        {pathname === "/register" && "Join us as a Once"}
                        {pathname === "/" && "A platform for Oncies"}
                    </p>
                    <div className="flex flex-wrap flex-col gap-2">
                        {pathname === "/" && (
                            <>
                                <a className="btn bg-secondary text-white" href="/login">Login</a>
                                <a className="btn bg-secondary text-white" href="/register">Register</a>
                            </>
                        )}
                        {pathname === "/login" && <Login />}
                        {pathname === "/register" && <Register />}
                    </div>
                </div>
            </div>
        </div>
    );
}