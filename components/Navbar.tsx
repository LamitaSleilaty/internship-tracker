"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const isAdmin = user?.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@email.com");

  useEffect(() => {
    setUser(getUser());

    const onStorage = () => setUser(getUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link href="/" className="font-bold">
          Internship Tracker
        </Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/internships">Internships</Link>
        {isAdmin && <Link href="/admin">Admin Panel</Link>}
      </div>

      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-500">{user.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth">Login / Sign Up</Link>
        )}
      </div>
    </nav>
  );
}
