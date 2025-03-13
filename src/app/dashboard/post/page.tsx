"use client"
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
    const { register, handleSubmit, reset } = useForm<TwicePostData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (data: TwicePostData) => {
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
        } catch (error) {
            setError("Failed to create post");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded">
            <input {...register("title", { required: true })} placeholder="Title" className="block mb-2 p-2 border" />
            <textarea {...register("content", { required: true })} placeholder="Content" className="block mb-2 p-2 border" />

            {/* 🔥 Member-Auswahl mit Select-Element */}
            <select {...register("memberName", { required: true })} className="block mb-2 p-2 border">
                <option value="">Select a TWICE member</option>
                {twiceMembers.map((member) => (
                    <option key={member} value={member}>
                        {member}
                    </option>
                ))}
            </select>

            <input type="file" {...register("twiceFile")} multiple className="block mb-2" />
            <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
                {loading ? "Uploading..." : "Create Post"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
    );
};

export default CreateTwicePost;
