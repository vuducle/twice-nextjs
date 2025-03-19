"use client";
import { useState } from "react";
import { registerOnce } from "../services/api";
import { useRouter } from "next/navigation";

// Liste der TWICE-Mitglieder
const twiceMembers = ["Nayeon", "Jeongyeon", "Momo", "Sana", "Jihyo", "Mina", "Dahyun", "Chaeyoung", "Tzuyu"];

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        bias: "",
    });
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        const denisFixDas = {
            ...form,
            bias: form.bias.toUpperCase(),
        };

        console.log("Sending data:", denisFixDas);

        try {
            await registerOnce(denisFixDas);
            setMessage("Registered! Redirecting...");
            router.push("/");
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            console.error("Error response:", error.response?.data || error.message);
            setMessage("Failed to register");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-500">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                {/* TWICE Logo or Header */}
                <h1 className="text-4xl font-bold text-pink-600 mb-6">OnceVerse Register</h1>

                {/* Username Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                </div>

                {/* Email Input */}
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                </div>

                {/* Confirm Password Input */}
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                </div>

                {/* Bias Dropdown */}
                <div className="mb-6">
                    <select
                        value={form.bias}
                        onChange={(e) => setForm({ ...form, bias: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    >
                        <option value="">Select your bias</option>
                        {twiceMembers.map((member) => (
                            <option key={member} value={member}>
                                {member}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Register Button */}
                <button
                    onClick={handleRegister}
                    className="w-full bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all"
                >
                    Register
                </button>

                {/* Message */}
                {message && (
                    <p className="mt-4 text-sm text-pink-700">{message}</p>
                )}

                {/* Fun TWICE-themed Footer */}
                <p className="mt-6 text-sm text-gray-600">
                    Join the ONCE family! 💖
                </p>
            </div>
        </div>
    );
}