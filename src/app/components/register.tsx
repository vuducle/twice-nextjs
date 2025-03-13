"use client";
import { useState } from "react";
import { registerOnce } from "../services/api";
import { useRouter } from "next/navigation";

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
            setMessage("Registered!");
            router.push("/");
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            console.error("Error response:", error.response?.data || error.message);
            setMessage("Failed to register");
        }
    };


    return (
        <div>
            <h1>Registrieren</h1>
            <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input type="password" placeholder="Password confirmation" onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            <input placeholder="Bias" onChange={(e) => setForm({ ...form, bias: e.target.value })} />
            <button onClick={handleRegister}>Registrieren</button>
            <p>{message}</p>
        </div>
    );
}
