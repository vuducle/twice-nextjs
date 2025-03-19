"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getUserInfo } from "@/app/services/api";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
    const [username, setUsername] = useState("");
    const [bias, setBias] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [posts, setPosts] = useState<string[]>(["Loving TWICE!", "Bias change? 🤔", "Concert tickets secured! 🎶"]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    interface TwicePost {
        id: string;
        title: string;
        content: string;
        memberName: string;
        imageUrl: string[];
        onceUsername: string;
        onceId: string;
    }

    // 🛠 User-Daten laden
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                console.log(data.twicePosts);

                setBias(data.bias);
                setBio(data.bio);
                setUsername(data.username);
                setPosts(data.twicePosts);
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
            await axios.put("http://localhost:8080/api/v1/twice/editOnce", formData, {
                withCredentials: true,
            });

            setSuccess(true);
            setIsOpen(false); // Modal schließen nach erfolgreicher Speicherung
        } catch (err) {
            console.error("Fehler:", err);
            setError("Fehler beim Speichern.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        const confirmDelete = window.confirm("Möchtest du diesen Post wirklich löschen?");
        if (!confirmDelete) return;
        try {
            await axios.delete(`http://localhost:8080/api/v1/twice-post/post/${postId}`, {
                withCredentials: true,
            });

            setPosts(posts.filter((post) => post.id !== postId));
        } catch (err) {
            console.error("Fehler beim Löschen des Posts:", err);
            alert("Fehler beim Löschen des Posts!");
        }
    };

    function TwiceRedVelvetBlackPink({ posts }: { posts: TwicePost[] }) {

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <figure className="relative aspect-square overflow-hidden">
                                {post.imageUrl && post.imageUrl.length > 0 ? (
                                    <Image
                                        src={"http://localhost:8080" + post.imageUrl[0]}
                                        alt={post.content}
                                        fill // Use `fill` to make the image responsive
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={true}
                                    />
                                ) : (
                                    <Image
                                        src={"/images/twice-default.jpg"}
                                        alt={"Platzhalter"}
                                        fill // Use `fill` to make the image responsive
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={true}
                                    />
                                )}
                            </figure>
                            <div className="card-body p-4">
                                <h2 className="card-title text-lg font-bold">{post.title}</h2>
                                <small className="text-sm text-gray-500">
                                    {post.onceUsername} - {post.memberName}
                                </small>
                                <p className="mt-2 text-gray-700">{post.content}</p>

                                <div className="card-actions flex justify-between mt-4">
                                    <Link
                                        href={`/dashboard/post/${post.id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        To post
                                    </Link>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="btn btn-error btn-sm"
                                    >
                                        🗑 Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No posts available</p>
                )}
            </div>
        );
    }
    return (
        <div className="max-w-2xl mx-auto bg-gray-700 p-6 rounded-lg shadow-md">
            {/* 🎭 Profil */}
            <div className="flex flex-col items-center">
                <img src={preview || "/images/twice-default.jpg"} alt="Profilbild" className="w-32 h-32 rounded-full border-4 border-gray-300" />
                <h2 className="text-xl font-bold mt-2 text-white">{username || "Once Fan"}</h2>
                <p className="text-gray-300">{bias ? `Bias: ${bias}` : "Bias not set"}</p>
                <p className="text-gray-400 italic">{bio || "No Bio avaiable."}</p>
                <button onClick={() => setIsOpen(true)} className="btn btn-primary mt-3">Profil bearbeiten</button>
            </div>

            {/* 📝 Posts, wenn verfügbar */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold">Your posts</h3>
                <div className="flex flex-wrap">
                    <TwiceRedVelvetBlackPink posts={posts} />
                </div>
            </div>

            {/* 🎭 Profil bearbeiten Modal */}
            {isOpen && (
                <dialog open className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="font-bold text-lg">Profil bearbeiten</h2>

                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-green-500">Saved!</p>}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                            <label className="block">
                                <span className="text-gray-700">Bias</span>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={bias}
                                    onChange={(e) => setBias(e.target.value)}
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700">Bio</span>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700">Profil image</span>
                                <input
                                    type="file"
                                    className="file-input w-full"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>

                            {preview && <img src={preview} alt="Preview" className="w-24 h-24 rounded-full mt-2 mx-auto" />}

                            <div className="modal-action">
                                <button type="button" onClick={() => setIsOpen(false)} className="btn btn-error">Cancel</button>
                                <button type="submit" className="btn btn-success" disabled={loading}>
                                    {loading ? "Save..." : "Saved"}
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
}
