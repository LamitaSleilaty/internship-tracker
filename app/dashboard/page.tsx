"use client";

import { useEffect, useState } from "react";
import { API, authHeaders, getUser } from "@/lib/auth";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    fetch(`${API}/internships/stats`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setStats);
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Applied</p>
          <p className="text-3xl font-bold text-blue-600">{stats.applied}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Interview</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.interview}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Accepted</p>
          <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>
    </div>
  );
}
