"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API, authHeaders, getUser } from "@/lib/auth";

export default function NewInternship() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p>You must be logged in</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    await fetch(`${API}/internships`, {
      method: "POST",
      headers: authHeaders(),
      body: form,
    });

    router.push("/internships");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Add Internship</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="company" placeholder="Company" className="border p-2 w-full" />
        <input name="position" placeholder="Position" className="border p-2 w-full" />
        <input name="location" placeholder="Location" className="border p-2 w-full" />
        <input
          type="file"
          name="cv"
          accept="application/pdf"
          className="border p-2 w-full mb-3"
        />
        <select name="status" className="border p-2 w-full">
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className="bg-black text-white px-4 py-2 w-full">Create</button>
      </form>
    </div>
  );
}
