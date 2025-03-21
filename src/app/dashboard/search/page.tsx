"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function UserSearch() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!query.trim()) {
            setUsers([]); // Clear the list if the query is empty
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(`http://localhost:8080/api/v1/twice?search=${query}`, { withCredentials: true });
                setUsers(response.data);
            } catch (err) {
                setError("Fehler beim Laden der Nutzer.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Search Bar */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-pink-700 mb-4">Search ONCE</h1>
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for ONCE..."
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                            aria-label="Search for ONCE"
                        />
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            🔍
                        </span>
                    </div>
                </div>

                {/* Loading Spinner */}
                {loading && (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="text-red-500 text-center my-4">{error}</p>}

                {/* User Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users.map((user) => (
                        <Link href={`/dashboard/${user.username}`} key={user.id} className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center space-x-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                    <Image
                                        src={"http://localhost:8080" + user.imageUrl}
                                        alt={user.username}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={true}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-pink-700">{user.username}</h2>
                                    <small className="text-purple-500">{user.bias}</small>
                                    <p className="text-sm text-gray-600">{user.bio || "No bio available."}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {!loading && users.length === 0 && query && (
                    <p className="text-center text-gray-500 mt-4">No results found.</p>
                )}
            </div>
        </div>
    );
}