"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteEditor } from "@/components/note-editor";
import { useNotes, useDeleteNote } from "@/lib/queries/notes";
import { useAuth } from "@/providers/auth-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeContent() {
  const { data: notes, isLoading, isError, refetch } = useNotes();
  const { user } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!isClient || !user) {
    return null;
  }

  const handleEdit = (note: { id: string; title: string; content: string }) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        console.log("Note deleted successfully");
        refetch();
      } catch (error) {
        console.error("Failed to delete note:", error);
        alert("Failed to delete note. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 bg-opacity-90 backdrop-blur border-b border-gray-700 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-white">Notes App</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted">{user.email}</span>
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="btn-outline"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Your Notes</h2>
          <Button
            onClick={() => {
              setEditingNote(null);
              setEditorOpen(true);
            }}
            className="btn-primary"
          >
            Create Note
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-300"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500 font-semibold">
            Failed to load notes. Please try again.
          </div>
        ) : notes?.length === 0 ? (
          <div className="text-center py-12 text-muted">
            You do not have any notes yet. Create your first note!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes?.map((note) => (
              <div
                key={note.id}
                className="card flex flex-col hover:border-gray-400"
              >
                <div className="mb-4">
                  <h3 className="truncate text-accent text-lg">{note.title}</h3>
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex-grow overflow-auto mb-4 text-sm text-muted whitespace-pre-wrap font-sans">
                    {note.content}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(note)}
                      className="btn-outline"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                      disabled={isDeleting}
                      className="btn-outline"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <NoteEditor
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setEditingNote(null);
        }}
        note={editingNote || undefined}
      />
    </div>
  );
}
