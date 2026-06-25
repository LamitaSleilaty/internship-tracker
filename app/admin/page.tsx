"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API, authHeaders, getUser } from "@/lib/auth";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@email.com";

export default function AdminPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      router.replace("/dashboard");
      return;
    }

    fetch(`${API}/internships`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setInternships);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="space-y-4">
        {internships.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
            <h2 className="font-semibold text-lg">{item.company}</h2>
            <p>{item.position}</p>
            <p>{item.location}</p>
            <p className="text-sm text-gray-500">User ID: {item.userId}</p>
            <p className="text-sm font-medium">Status: {item.status}</p>

            {item.cvUrl && (
              <a href={item.cvUrl} target="_blank" className="text-blue-600 underline">
                View CV
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
