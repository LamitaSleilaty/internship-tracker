"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [internships, setInternships] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("internships")
        .select("*")
        .order("created_at", { ascending: false });

      setInternships(data || []);
    };

    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin Panel
      </h1>

      <div className="space-y-4">
        {internships.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
            <h2 className="font-semibold text-lg">
              {item.company}
            </h2>

            <p>{item.position}</p>
            <p>{item.location}</p>

            <p className="text-sm text-gray-500">
              User ID: {item.user_id}
            </p>

            <p className="text-sm font-medium">
              Status: {item.status}
            </p>

            {item.cv_url && (
              <a
                href={item.cv_url}
                target="_blank"
                className="text-blue-600 underline"
              >
                View CV
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}