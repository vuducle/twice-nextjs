"use client";
import { useState } from "react";
import LogoutButton from "@/app/components/logout";
import { Menu, X } from "lucide-react"; // Icons for the menu

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-pink-50 to-purple-50">
            {/* Sidebar (Desktop: visible, Mobile: hidden) */}
            <aside
                className={`fixed inset-y-0 left-0 top-0 bg-gradient-to-b from-pink-500 to-purple-600 text-white w-64 p-4 transform ${
                    isOpen ? "translate-x-0 z-10" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out md:translate-x-0 md:fixed`}
            >
                <h2 className="text-2xl font-bold mb-6 text-center">ONCE Navigation</h2>
                <ul className="space-y-2">
                    <li>
                        <a
                            href="/dashboard"
                            className="block p-3 hover:bg-pink-600 rounded-lg transition-colors duration-200 flex items-center"
                        >
                            🏠 Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/post"
                            className="block p-3 hover:bg-pink-600 rounded-lg transition-colors duration-200 flex items-center"
                        >
                            ✨ Create
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/profile"
                            className="block p-3 hover:bg-pink-600 rounded-lg transition-colors duration-200 flex items-center"
                        >
                            👤 Profile
                        </a>
                    </li>
                    <li>
                        <LogoutButton />
                    </li>
                </ul>
            </aside>

            {/* Overlay for Mobile Menu (only shown when isOpen is true) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Main Content with Navbar */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Navbar with Burger Menu */}
                <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex items-center md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white focus:outline-none"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <h1 className="text-lg font-bold ml-4">OnceVerse</h1>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto bg-white rounded-lg shadow-md m-4">
                    {children}
                </main>
            </div>
        </div>
    );
}