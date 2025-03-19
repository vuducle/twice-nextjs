"use client";
import { useState } from "react";
import { loginOnce, getMe } from "../services/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await loginOnce({ username, password });
            setMessage("Login successful! Redirecting...");
            router.push("/dashboard");
            const response = await getMe();
            console.log("Benutzer:", response.data);
        } catch (error) {
            setMessage("Login fehlgeschlagen.");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-500">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                {/* TWICE Logo or Header */}
                <h1 className="text-4xl font-bold text-pink-600 mb-6">OnceVerse</h1>

                {/* Username Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                </div>

                {/* Password Input */}
                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Passwort"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                </div>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    className="w-full bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all"
                >
                    Login
                </button>

                {/* Message */}
                {message && (
                    <p className="mt-4 text-sm text-pink-700">{message}</p>
                )}

                {/* Fun TWICE-themed Footer */}
                <p className="mt-6 text-sm text-gray-600">
                    Only ONCE can access this! 💖
                </p>
            </div>
        </div>
    );
}