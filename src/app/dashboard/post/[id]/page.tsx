"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // 💡 Für das Modal-Bild

    useEffect(() => {
        if (!id) return;
        axios.get(`http://localhost:8080/api/v1/twice-post/post/${id}`)
            .then((res) => setPost(res.data))
            .catch(() => setError("Post not found"))
            .finally(() => setLoading(false));

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedImage(null);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [id]);

    if (loading) return <p>Lade Post...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <small>{post.onceUsername} - {post.memberName}</small>
            <p className="text-sm text-gray-400">Erstellt am: {new Date(post.createdAt).toLocaleDateString()}</p>

            {/* GRID MIT BILDERN */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.imageUrl.map((url, i) => (
                    <div key={i} className="relative w-full h-48 cursor-pointer" onClick={() => setSelectedImage(url)}>
                        <Image
                            src={`http://localhost:8080${url}`}
                            fill
                            className="object-cover rounded-lg shadow-md"
                            alt={`Post Image ${i}`}
                        />
                    </div>
                ))}
            </div>

            <p className="text-gray-600">{post.content}</p>

            {/* MODAL (Wird nur angezeigt, wenn `selectedImage` nicht null ist) */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-3xl w-full p-4">
                        <Image
                            src={`http://localhost:8080${selectedImage}`}
                            width={800}
                            height={600}
                            className="rounded-lg shadow-lg mx-auto"
                            alt="Selected Post Image"
                        />
                        <button className="absolute top-2 right-2 text-white text-3xl" onClick={() => setSelectedImage(null)}>×</button>
                    </div>
                </div>
            )}
        </div>
    );
}
