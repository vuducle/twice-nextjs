'use client'
import { logoutOnce } from "../services/api";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logoutOnce();
            router.replace("/");
        } catch (error) {
            console.error("Fehler beim Logout:", error);
        }
    };

    return <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>;
}
