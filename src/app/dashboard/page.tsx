"use client";
import { useEffect, useState } from "react";
import { getUserInfo } from "../services/api";
import Image from 'next/image';

export default function Dashboard() {
    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState("/images/twice-default.jpg");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                console.log("User Info:", data); // Debugging
                setUsername(data.username);

                setProfilePic("http://localhost:8080" + data.imageUrl);
            } catch (error) {
                console.error("Fehler beim Laden der User-Info:", error);
            }
        };

        fetchUserInfo();
    }, []);


    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">OnceVerse</h1>
            <p>Welcome back, <span className="text-pink-500 font-semibold">{username}</span>!</p>
            <Image src={profilePic} alt="OnceVerse" height={150} width={150} />

        </main>
    );
}
