"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function OAuthHandlerPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/"); // ✅ redirect to home or dashboard
      } else {
        console.error("No session found", error);
        router.push("/login"); // fallback
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Logging in...</p>
    </div>
  );
}
