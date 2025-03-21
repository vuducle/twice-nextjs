"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface UserProfile {
    username: string;
    bias: string;
    bio: string;
    imageUrl: string;
    twicePost: {
        id: string;
        title: string;
        content: string;
        memberName: string;
        onceUsername: string;
        imageUrl: string[];
    }[];
}

export default function ProfilePage() {
    const { slug } = useParams(); // Holt den Usernamen aus der URL
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/twice/${slug}`, {
                    withCredentials: true,
                });
                setUser(res.data);
                console.log(res.data);
            } catch (err) {
                setError("User not found.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchUserProfile();
    }, [slug]);

    if (loading) return <p className="text-center text-gray-500">Loading profile...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Profilinfo */}
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500 shadow-md">
                        <Image
                            src={"http://localhost:8080" + user?.imageUrl || "/images/twice-default.jpg"}
                            alt="Profilbild"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-3xl font-bold mt-4 text-pink-700">{user?.username || "Unknown User"}</h2>
                    <p className="text-lg text-purple-600">{user?.bias ? `Bias: ${user.bias}` : "No bias set"}</p>
                    <p className="text-gray-600 italic text-center">{user?.bio || "No Bio available."}</p>
                </div>

                {/* Posts */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-pink-700 mb-6">Posts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user?.twicePost.length ? (
                            user.twicePost.map((post) => (
                                <div key={post.id} className="card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                        <Image
                                            src={"http://localhost:8080" + post.imageUrl[0] || "/images/twice-default.jpg"}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-xl font-bold text-pink-700">{post.title}</h4>
                                        <small className="text-sm text-gray-500">
                                            {post.onceUsername} - {post.memberName}
                                        </small>
                                        <p className="text-sm text-gray-600 mt-2">{post.content}</p>
                                        <Link
                                            href={`/dashboard/post/${post.id}`}
                                            className="mt-4 inline-block px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all"
                                        >
                                            View Post
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No posts available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}