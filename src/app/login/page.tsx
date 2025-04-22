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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl p-8 shadow-xl bg-white/10 backdrop-blur border border-white/20 text-white">
        <h1 className="mb-6 text-center text-3xl font-semibold text-white drop-shadow-md">
          Login
        </h1>

        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

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
              className="bg-white/10 border border-white/20 text-white placeholder:text-white/60"
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
              className="bg-white/10 border border-white/20 text-white placeholder:text-white/60"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Login
          </Button>
        </form>

        <div className="my-4 flex items-center text-white/70">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="mx-4 text-sm">or</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>

        <Button
          onClick={signInWithGoogle}
          variant="outline"
          className="w-full border-black/20 text-black hover:bg-white/10"
        >
          Continue with Google
        </Button>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => router.push("/signup")}
            className="text-white underline underline-offset-4 hover:text-purple-300"
          >
            Don&apos;t have an account? Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}
