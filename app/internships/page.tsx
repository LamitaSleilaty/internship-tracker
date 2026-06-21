"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { deleteInternship, updateInternshipStatus } from "@/app/action";
import { addInternship } from "@/app/action";

export default function InternshipsPage() {
  const [user, setUser] = useState<any>(null);
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    setUser(currentUser);

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("internships")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    setInternships(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading...</p>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">
          You are not logged in
        </h1>

        <Link
          href="/auth/login"
          className="bg-black text-white px-5 py-2 rounded"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Internships</h1>

        <Link
          href="/internships/new"
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + New Internship
        </Link>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {internships.length === 0 ? (
          <p className="text-gray-500">No internships yet.</p>
        ) : (
          internships.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl p-5 flex justify-between items-start shadow-sm hover:shadow-md transition"
            >
              {/* LEFT SIDE */}
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">
                  {item.company}
                </h2>

                <p className="text-gray-600">
                  {item.position}
                </p>

                <p className="text-gray-400 text-sm">
                  {item.location}
                </p>

                {/* STATUS BADGE */}
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                    item.status === "applied"
                      ? "bg-blue-100 text-blue-700"
                      : item.status === "interview"
                      ? "bg-yellow-100 text-yellow-700"
                      : item.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* RIGHT SIDE ACTIONS */}
              <div className="flex flex-col gap-2 items-end">
                
                {/* UPDATE */}
                <form
                  action={updateInternshipStatus}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={item.id}
                  />

                  <select
                    name="status"
                    defaultValue={item.status}
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button className="text-blue-600 text-sm hover:underline">
                    Update
                  </button>
                </form>

                {/* DELETE */}
                <form action={deleteInternship.bind(null, item.id)}>
                  <button className="text-red-500 text-sm hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}