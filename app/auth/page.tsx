"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API, setToken } from "@/lib/auth";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      setEmailSent(true);
      setLoading(false);
      return;
    }

    setToken(data.token);

    if (data.user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@email.com")) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded text-center">
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-gray-500 mb-4">
          We sent a verification link to <strong>{email}</strong>. Click it to confirm your account.
        </p>
        <button
          className="text-blue-600 underline text-sm"
          onClick={() => { setEmailSent(false); setMode("login"); }}
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold text-center mb-2">
        {mode === "login" ? "Login" : "Sign Up"}
      </h1>

      <p className="text-gray-500 text-center mb-6">
        {mode === "login" ? "Welcome back!" : "Create a new account"}
      </p>

      <input
        className="border w-full p-2 mb-3 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border w-full p-2 mb-3 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleAuth}
        disabled={loading}
        className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
      >
        {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
      </button>

      <p className="text-center text-sm mt-4">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <button className="text-blue-600 underline" onClick={() => setMode("signup")}>
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button className="text-blue-600 underline" onClick={() => setMode("login")}>
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
}
