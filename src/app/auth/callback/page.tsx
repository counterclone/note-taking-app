"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        // Optional: store in state or cookies if needed
        router.push("/"); // Redirect to your app's homepage or dashboard
      } else {
        console.error("No session found", error);
        router.push("/login");
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
