"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNote, useUpdateNote } from "@/lib/queries/notes";
import { useSummarize } from "@/lib/hooks/use-summarize";
import { useState } from "react";

type NoteEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: { id: string; title: string; content: string };
};

export function NoteEditor({ open, onOpenChange, note }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  const { mutateAsync: summarize } = useSummarize(); // Changed to mutateAsync

  const handleSummarize = async () => {
    if (!content.trim()) {
      alert("Please enter some content to summarize");
      return;
    }

    setIsSummarizing(true);
    try {
      const result = await summarize(content);
      setContent((prev) => `${prev}\n\n---\nSummary: ${result.summary}`);
      console.log("Summary added successfully");
    } catch (error) {
      console.error("Failed to generate summary:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    try {
      if (note) {
        await updateNote({ id: note.id, title, content });
        console.log("Note updated successfully");
      } else {
        await createNote({ title, content });
        console.log("Note created successfully");
      }
      onOpenChange(false);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to save note. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "Create Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required
            />
          </div>
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleSummarize}
              disabled={isSummarizing || !content.trim()}
            >
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </Button>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  if (!note) {
                    setTitle("");
                    setContent("");
                  }
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {note
                  ? isUpdating
                    ? "Updating..."
                    : "Update"
                  : isCreating
                  ? "Creating..."
                  : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
