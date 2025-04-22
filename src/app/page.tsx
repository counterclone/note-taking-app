"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteEditor } from "@/components/note-editor";
import { useNotes, useDeleteNote } from "@/lib/queries/notes";
import { useAuth } from "@/providers/auth-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Prevent SSR for the home page to avoid hydration issues
const HomeContent = dynamic(() => import("./HomeContent"), { ssr: false });

export default function Home() {
  return <HomeContent />;
}
