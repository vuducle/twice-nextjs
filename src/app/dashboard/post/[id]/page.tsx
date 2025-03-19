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

    useEffect(() => {
        if (!id) return;
        axios.get(`http://localhost:8080/api/v1/twice-post/post/${id}`)
            .then((res) => {
                setPost(res.data);
                setUpvotes(res.data.upvotedBy.length || 0);
                setComments(res.data.comments || []);
            })
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

    const handleUpvote = async () => {
        try {
            await axios.post(`http://localhost:8080/api/v1/twice-post/post/${id}/upvote`, {}, {withCredentials: true});
            setUpvotes(upvotes + 1);
        } catch (error) {
            console.error("Fehler beim Upvoten", error);
        }
    };

    const handleCommentUpvote = async (commentId) => {
        try {
            await axios.post(`http://localhost:8080/api/v1/twice-post/comment/${commentId}/upvote`, {}, { withCredentials: true });

            // Aktualisiere die Kommentare im State
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

            }, {withCredentials: true});
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("Fehler beim Kommentieren", error);
        }
    };

    if (loading) return <p>Lade Post...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    // @ts-ignore
    return (
        <div className="max-w-2xl mx-auto p-4 bg-gray-700 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <small>{post.onceUsername} - {post.memberName}</small>
            <p className="text-sm text-gray-400">Erstellt am: {new Date(post.createdAt).toLocaleDateString()}</p>

            <div className="flex items-center space-x-2 my-2">
                <button onClick={handleUpvote} className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded-lg shadow">
                    <FaArrowUp />
                    <span>{upvotes}</span>
                </button>
            </div>

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

            <p className="text-gray-600 my-4">{post.content}</p>

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
                <h3 className="text-lg font-semibold">Kommentare</h3>
                <div className="space-y-4 mt-2">
                    {comments.map((comment, index) => (
                        <div key={index} className="p-3 bg-gray-100 rounded-lg">
                            <p className="text-gray-800">{comment.content}</p>
                            <small className="text-gray-500">{comment.once.username} - {new Date(comment.createdAt).toLocaleString()}</small>
                            <div className="flex items-center space-x-2 mt-2">
                                <button onClick={() => handleCommentUpvote(comment.id)} className="flex items-center space-x-1 bg-blue-400 px-2 py-1 rounded-lg shadow">
                                    <FaArrowUp /><span>{comment.upvotedBy.length || 0}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Schreibe einen Kommentar..."
                        className="w-full p-2 border rounded-lg"
                    ></textarea>
                    <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow">Posten</button>
                </div>
            </div>
        </div>
    );
}
