"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { addInternship } from "@/app/action";
import { useRouter } from "next/navigation";

export default function NewInternship() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p>You must be logged in</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">
        Add Internship
      </h1>

      <form
        action={async (formData) => {
          await addInternship(formData);
          router.push("/internships"); // go back after create
        }}
        className="space-y-3"
      >
        {/* 🔥 FIX: user_id is REQUIRED */}
        <input type="hidden" name="user_id" value={user.id} />

        <input
          name="company"
          placeholder="Company"
          className="border p-2 w-full"
        />

        <input
          name="position"
          placeholder="Position"
          className="border p-2 w-full"
        />

        <input
          name="location"
          placeholder="Location"
          className="border p-2 w-full"
        />

        <select name="status" className="border p-2 w-full">
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        <button className="bg-black text-white px-4 py-2 w-full">
          Create
        </button>
      </form>
    </div>
  );
}