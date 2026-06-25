"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API, setToken } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setError("Invalid verification link.");
      setStatus("error");
      return;
    }

    fetch(`${API}/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setStatus("error");
          return;
        }
        setToken(data.token);
        router.push("/dashboard");
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
        setStatus("error");
      });
  }, [params, router]);

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded text-center">
        <h1 className="text-2xl font-bold mb-2">Verification failed</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <a href="/auth" className="text-blue-600 underline text-sm">Back to login</a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded text-center">
      <h1 className="text-2xl font-bold mb-2">Verifying your email...</h1>
      <p className="text-gray-500">Please wait.</p>
    </div>
  );
}
