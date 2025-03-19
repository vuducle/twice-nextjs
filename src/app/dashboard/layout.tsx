"use client"
import { useState } from "react";
import LogoutButton from "@/app/components/logout";
import { Menu, X } from "lucide-react"; // Icons für das Menü



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar (Desktop: sichtbar, Mobile: hidden) */}
            <aside className={`fixed inset-y-0 left-0 top-0 bg-gray-800 text-white w-64 p-4 transform ${isOpen ? "translate-x-0 z-10" : "-translate-x-full"} transition-transform md:relative md:translate-x-0`}>
                <h2 className="text-xl font-bold">Navigation</h2>
                <ul className="mt-4 space-y-2">
                    <li><a href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a></li>
                    <li><a href="/dashboard/post" className="block p-2 hover:bg-gray-700 rounded">Create</a></li>
                    <li><a href="/dashboard/profile" className="block p-2 hover:bg-gray-700 rounded">Profil</a></li>
                    <li><LogoutButton /></li>
                </ul>
            </aside>

            {/* Overlay für Mobile-Menü (wird nur bei isOpen angezeigt) */}
            {isOpen && <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>}

            {/* Main Content mit Navbar */}
            <div className="flex-1 flex flex-col">
                {/* Navbar mit Burger-Menü */}
                <header className="bg-gray-900 text-white p-4 flex items-center md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <h1 className="text-lg font-bold ml-4">OnceVerse</h1>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}

