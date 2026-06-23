"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;
      const isAdmin = user.email === "admin@email.com";

     
      let totalQuery = supabase
    .from("internships")
    .select("*", { count: "exact", head: true });

     if (!isAdmin) {
      totalQuery = totalQuery.eq("user_id", user.id);
    }

    const { count: total } = await totalQuery;
      
      let appliedQuery = supabase
  .from("internships")
  .select("*", { count: "exact", head: true })
  .eq("status", "applied");

if (!isAdmin) {
  appliedQuery = appliedQuery.eq("user_id", user.id);
}

const { count: applied } = await appliedQuery;
      
   let interviewQuery = supabase
  .from("internships")
  .select("*", { count: "exact", head: true })
  .eq("status", "interview");

if (!isAdmin) {
  interviewQuery = interviewQuery.eq("user_id", user.id);
}

const { count: interview } = await interviewQuery;
   
      let acceptedQuery = supabase
  .from("internships")
  .select("*", { count: "exact", head: true })
  .eq("status", "accepted");

if (!isAdmin) {
  acceptedQuery = acceptedQuery.eq("user_id", user.id);
}

const { count: accepted } = await acceptedQuery;

let rejectedQuery = supabase
  .from("internships")
  .select("*", { count: "exact", head: true })
  .eq("status", "rejected");

if (!isAdmin) {
  rejectedQuery = rejectedQuery.eq("user_id", user.id);
}

const { count: rejected } = await rejectedQuery;
      setStats({
        total: total || 0,
        applied: applied || 0,
        interview: interview || 0,
        accepted: accepted || 0,
        rejected: rejected || 0,
      });
    };

    load();
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
          <p className="text-3xl font-bold text-blue-600">
            {stats.applied}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Interview</p>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.interview}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Accepted</p>
          <p className="text-3xl font-bold text-green-600">
            {stats.accepted}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Rejected</p>
          <p className="text-3xl font-bold text-red-600">
            {stats.rejected}
          </p>
        </div>

      </div>
    </div>
  );
}