"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    // listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      () => {
        getUser();
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // refresh UI
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      
      {/* LEFT */}
      <div className="flex gap-6">
        <Link href="/" className="font-bold">
          Internship Tracker
        </Link>

        <Link href="/dashboard">Dashboard</Link>
        <Link href="/internships">Internships</Link>
      </div>

      {/* RIGHT */}
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-500">
              {user.email}
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm border rounded"
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              className="px-4 py-2 text-sm bg-black text-white rounded"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}