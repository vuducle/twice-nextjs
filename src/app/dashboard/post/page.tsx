"use client";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

interface TwicePostData {
    title: string;
    content: string;
    memberName: string;
    twiceFile: FileList;
}

// Liste der TWICE-Mitglieder
const twiceMembers = ["Nayeon", "Jeongyeon", "Momo", "Sana", "Jihyo", "Mina", "Dahyun", "Chaeyoung", "Tzuyu"];

const CreateTwicePost = () => {
    const { register, handleSubmit, reset, setError: setFormError, clearErrors } = useForm<TwicePostData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedMember, setSelectedMember] = useState(""); // Zustand für ausgewähltes Mitglied

    const onSubmit = async (data: TwicePostData) => {
        // Validate number of files before proceeding
        if (data.twiceFile && data.twiceFile.length > 5) {
            setError("You can upload a maximum of 5 files.");
            return; // Stop the submission if more than 5 files are selected
        }

        setLoading(true);
        setError("");

        const formData = new FormData();

        // JSON-Daten als Blob hinzufügen (WICHTIG!)
        const jsonBlob = new Blob([JSON.stringify({
            title: data.title,
            content: data.content,
            memberName: data.memberName
        })], { type: "application/json" });

        formData.append("body", jsonBlob);

        // Bilder anhängen
        if (data.twiceFile.length > 0) {
            for (let i = 0; i < data.twiceFile.length; i++) {
                formData.append("twiceFile", data.twiceFile[i]);
            }
        }

        try {
            await axios.post("http://localhost:8080/api/v1/twice-post", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            alert("Post created successfully!");
            reset();
            setSelectedMember(""); // Zurücksetzen des ausgewählten Mitglieds
        } catch (error) {
            setError("Failed to create post");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-pink-300 rounded-lg shadow-lg max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center text-white">Create a TWICE Post</h1>

            {/* Title Input */}
            <input
                {...register("title", { required: true })}
                placeholder="Title"
                className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            {/* Content Textarea */}
            <textarea
                {...register("content", { required: true })}
                placeholder="Content"
                className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                rows={4}
            />

            {/* Member Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select a TWICE Member</label>
                <select
                    {...register("memberName", { required: true })}
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                    <option value="">Choose a member...</option>
                    {twiceMembers.map((member) => (
                        <option key={member} value={member}>
                            {member}
                        </option>
                    ))}
                </select>
            </div>

            {/* File Upload */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (Max 5 files)</label>
                <input
                    type="file"
                    {...register("twiceFile")}
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 5) {
                            setError("You can upload a maximum of 5 files.");
                        } else {
                            setError(""); // Clear the error if the number of files is valid
                        }
                    }}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="ml-2">Uploading...</span>
                    </div>
                ) : (
                    "Create Post"
                )}
            </button>

            {/* Error Message */}
            {error && (
                <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
            )}
        </form>
    );
};

export default CreateTwicePost;