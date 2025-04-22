"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8 shadow-md bg-gray-900 bg-opacity-80 backdrop-blur border border-gray-700">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Login
        </h1>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field w-full"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field w-full"
            />
          </div>
          <Button type="submit" className="w-full btn-primary">
            Login
          </Button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-4 text-muted">or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <Button
          onClick={signInWithGoogle}
          variant="outline"
          className="w-full btn-outline"
        >
          Continue with Google
        </Button>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => router.push("/signup")}
            className="text-accent hover:text-indigo-400"
          >
            Don&apos;t have an account? Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}
