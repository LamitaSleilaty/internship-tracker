"use client";

import { useEffect, useState } from "react";
import { API, authHeaders, getUser } from "@/lib/auth";
import Link from "next/link";

export default function InternshipsPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const currentUser = getUser();
    setUser(currentUser);

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const res = await fetch(`${API}/internships?mine=true`, { headers: authHeaders() });
    setInternships(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`${API}/internships/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    setInternships((prev) => prev.filter((i) => i.id !== id));
  };

  const handleStatusUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const status = fd.get("status") as string;

    await fetch(`${API}/internships/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status }),
    });

    setInternships((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
        <Link href="/auth" className="bg-black text-white px-5 py-2 rounded">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Internships</h1>
        <Link
          href="/internships/new"
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + New Internship
        </Link>
      </div>

      <div className="space-y-4">
        {internships.length === 0 ? (
          <p className="text-gray-500">No internships yet.</p>
        ) : (
          internships.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl p-5 flex justify-between items-start shadow-sm hover:shadow-md transition"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{item.company}</h2>
                <p className="text-gray-600">{item.position}</p>
                <p className="text-gray-400 text-sm">{item.location}</p>

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

                {item.cvUrl && (
                  <a
                    href={item.cvUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition"
                  >
                    View CV
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-2 items-end">
                <form
                  onSubmit={(e) => handleStatusUpdate(e, item.id)}
                  className="flex gap-2 items-center"
                >
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

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
