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
            setMessage("Login successful!...");
            router.push("/dashboard");
            const response = await getMe();
            console.log("Benutzer:", response.data);
        } catch (error) {
            setMessage("Login fehlgeschlagen.");
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Passwort" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>{message}</p>
        </div>
    );
}
