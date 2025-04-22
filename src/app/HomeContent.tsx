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
    <div className="min-h-screen bg-background text-foreground">
      <header className="shadow-md backdrop-blur border-b border-border bg-background/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-foreground drop-shadow-md">Notes App</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="border-border hover:bg-accent text-foreground"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground drop-shadow">Your Notes</h2>
          <Button
            onClick={() => {
              setEditingNote(null);
              setEditorOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Note
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive">
            Failed to load notes. Please try again.
          </div>
        ) : notes?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            You do not have any notes yet. Create your first note!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes?.map((note) => (
              <Card
                key={note.id}
                className="hover:shadow-lg transition-shadow flex flex-col bg-card border border-border text-card-foreground"
              >
                <CardHeader>
                  <CardTitle className="truncate text-card-foreground">{note.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow overflow-auto mb-4">
                    <pre className="whitespace-pre-wrap font-sans text-muted-foreground">
                      {note.content}
                    </pre>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(note)}
                      className="border-border hover:bg-muted text-foreground"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                      disabled={isDeleting}
                      className="text-destructive-foreground"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
