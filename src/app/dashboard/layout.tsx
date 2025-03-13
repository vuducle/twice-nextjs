import LogoutButton from "@/app/components/logout";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold">Navigation</h2>
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/dashboard/post">Create</a></li>
                    <li><a href="/dashboard/profile">Profil</a></li>

                    <li>
                        <LogoutButton />
                    </li>
                </ul>
            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}

