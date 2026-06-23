"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { addInternship } from "@/app/action";
import { useRouter } from "next/navigation";

export default function NewInternship() {
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
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
  let cv_url = "";

  if (file) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(fileName, file);

    if (uploadError) {
      console.log(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    cv_url = data.publicUrl;
  }

  const internshipData = {
    user_id: formData.get("user_id"),
    company: formData.get("company"),
    position: formData.get("position"),
    location: formData.get("location"),
    status: formData.get("status"),
    cv_url,
  };

  await addInternship(internshipData);
  

  router.push("/internships");
}}
        className="space-y-3"
      >
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
        <input
         type="file"
         accept="application/pdf"
         onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 w-full mb-3"
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