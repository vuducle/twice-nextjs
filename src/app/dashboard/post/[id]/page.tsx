"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { FaArrowUp } from "react-icons/fa";

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [upvotes, setUpvotes] = useState(0);
    const [hasUpvoted, setHasUpvoted] = useState(false); // Track if the user has upvoted

    useEffect(() => {
        if (!id) return;
        axios.get(`http://localhost:8080/api/v1/twice-post/post/${id}`, { withCredentials: true })
            .then((res) => {
                setPost(res.data);
                setUpvotes(res.data.upvotedBy.length || 0);
                setComments(res.data.comments || []);

                // Check if the current user has already upvoted
                const currentUserId = res.data.currentUserId; // Assuming the API returns the current user's ID
                setHasUpvoted(res.data.upvotedBy.includes(currentUserId));
            })
            .catch(() => setError("Post not found"))
            .finally(() => setLoading(false));

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedImage(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [id]);

    const handleUpvote = async () => {
        if (hasUpvoted) {
            alert("You've already upvoted this post!");
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/v1/twice-post/post/${id}/upvote`, {}, { withCredentials: true });
            setUpvotes(upvotes + 1);
            setHasUpvoted(true); // Mark the post as upvoted by the current user
        } catch (error) {
            console.error("Fehler beim Upvoten", error);
        }
    };

    const handleCommentUpvote = async (commentId) => {
        try {
            await axios.post(`http://localhost:8080/api/v1/twice-post/comment/${commentId}/upvote`, {}, { withCredentials: true });

            // Update the comments in the state
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId ? { ...comment, upvotes: (comment.upvotes || 0) + 1 } : comment
                )
            );
        } catch (error) {
            console.error("Fehler beim Upvoten", error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await axios.post(`http://localhost:8080/api/v1/twice-post/post/${id}/comment`, {
                content: newComment,
            }, { withCredentials: true });
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("Fehler beim Kommentieren", error);
        }
    };

    if (loading) return <p className="text-center text-pink-600">Lade Post...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    // @ts-ignore
    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-lg">
            {/* Post Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-pink-700">{post.title}</h2>
                <small className="text-purple-600">{post.onceUsername} - {post.memberName}</small>
                <p className="text-sm text-gray-500">Erstellt am: {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Upvote Button */}
            <div className="flex items-center space-x-2 mb-6">
                <button
                    onClick={handleUpvote}
                    disabled={hasUpvoted} // Disable the button if the user has already upvoted
                    className={`flex items-center space-x-2 ${
                        hasUpvoted ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                    } text-white px-4 py-2 rounded-lg shadow transition-all`}
                >
                    <FaArrowUp />
                    <span>{upvotes}</span>
                </button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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

            {/* Post Content */}
            <p className="text-gray-700 mb-6">{post.content}</p>

            {/* Image Modal */}
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

            {/* Kommentarbereich */}
            <div className="mt-6">
                <h3 className="text-2xl font-bold text-pink-700 mb-4">Kommentare</h3>
                <div className="space-y-4">
                    {comments.map((comment, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                            <p className="text-gray-800">{comment.content}</p>
                            <small className="text-gray-500">{comment.onceUsername} - {new Date(comment.createdAt).toLocaleString()}</small>
                            <div className="flex items-center space-x-2 mt-2">
                                <button
                                    onClick={() => handleCommentUpvote(comment.id)}
                                    className="flex items-center space-x-1 bg-pink-400 text-white px-2 py-1 rounded-lg shadow hover:bg-pink-500 transition-all"
                                >
                                    <FaArrowUp />
                                    <span>{comment.upvotedBy ? comment.upvotedBy.length : 0}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Comment Section */}
                <div className="mt-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Schreibe einen Kommentar..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    ></textarea>
                    <button
                        onClick={handleAddComment}
                        className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition-all"
                    >
                        Posten
                    </button>
                </div>
            </div>
        </div>
    );
}