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
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md rounded-xl bg-white bg-opacity-10 backdrop-blur-md p-8 shadow-2xl border-2 border-purple-600">
        <h1 className="mb-6 text-center text-3xl font-semibold text-white">
          Login
        </h1>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-3 w-full rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-white"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-3 w-full rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Login
          </Button>
        </form>

        <div className="my-4 flex items-center text-white">
          <div className="flex-grow border-t border-white/40"></div>
          <span className="mx-4">or</span>
          <div className="flex-grow border-t border-white/40"></div>
        </div>

        <Button
          onClick={signInWithGoogle}
          variant="outline"
          className="w-full py-3 border-purple-600 text-purple-600 hover:bg-purple-100 border-2 rounded-lg transition duration-200"
        >
          Continue with Google
        </Button>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => router.push("/signup")}
            className="text-purple-600 hover:underline"
          >
            Don&apos;t have an account? Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}
