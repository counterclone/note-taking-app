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
  const { mutate: createNote } = useCreateNote();
  const { mutate: updateNote } = useUpdateNote();
  const { mutateAsync: summarize } = useSummarize();

  const handleSummarize = async () => {
    if (!content) return;
    setIsSummarizing(true);
    try {
      const result = await summarize(content);
      setContent((prev) => `${prev}\n\nSummary:\n${result.summary}`);
    } catch (error) {
      console.error("Summarization failed:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note) {
      updateNote({ id: note.id, title, content });
    } else {
      createNote({ title, content });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "Create Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
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
              disabled={isSummarizing || !content}
            >
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </Button>
            <Button type="submit">{note ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
