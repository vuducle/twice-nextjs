"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getUserInfo } from "@/app/services/api";

export default function EditOnceForm() {
    const [username, setUsername] = useState("");
    const [bias, setBias] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // 🛠 User-Daten laden
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                console.log(data);
                setBias(data.bias);
                setBio(data.bio);
                setUsername(data.username);
                setPreview("http://localhost:8080" + data.imageUrl || "/images/twice-default.jpg");
            } catch (err) {
                console.error("Fehler beim Laden der User-Daten:", err);
            }
        };

        fetchUserInfo();
    }, []);

    // 🖼 Bild-Preview aktualisieren
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // 📤 Daten an Backend senden
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append("body", new Blob([JSON.stringify({ bias, bio })], { type: "application/json" }));
        if (image) formData.append("file", image);

        try {
            const response = await axios.put("http://localhost:8080/api/v1/twice/editOnce", formData, {
                withCredentials: true, // Session-Cookie senden
            });

            console.log("Update erfolgreich:", response.data);
            setSuccess(true);
        } catch (err) {
            console.error("Fehler:", err);
            setError("Fehler beim Speichern.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-green-400 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Profil bearbeiten</h2>
            {username}

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Erfolgreich gespeichert!</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="block">
                    <span className="text-gray-700">Bias</span>
                    <input
                        type="text"
                        className="mt-1 block w-full border p-2 rounded"
                        value={bias}
                        onChange={(e) => setBias(e.target.value)}
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Bio</span>
                    <textarea
                        className="mt-1 block w-full border p-2 rounded"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Profilbild</span>
                    <input
                        type="file"
                        className="mt-1 block w-full"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>

                {preview && <img src={preview} alt="Preview" className="w-32 h-32 rounded-full mt-2" />}

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Speichern..." : "Speichern"}
                </button>
            </form>
        </div>
    );
}
