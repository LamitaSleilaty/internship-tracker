"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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

    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      if (data?.user?.email === "admin@email.com") {
        router.push("/admin");
        return;
      }

      router.push("/dashboard");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(typeof error.message === "string" ? error.message : "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      
      if (data?.session) {
        router.push("/dashboard");
        return;
      }

      setEmailSent(true);
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
        {mode === "login"
          ? "Welcome back!"
          : "Create a new account"}
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

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <button
        onClick={handleAuth}
        disabled={loading}
        className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
      >
        {loading
          ? "Loading..."
          : mode === "login"
          ? "Login"
          : "Sign Up"}
      </button>

      <p className="text-center text-sm mt-4">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
}