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
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [error, setError] = useState('')
  const { mutate: createNote, isPending: isCreating } = useCreateNote()
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote()
  const { mutate: summarize } = useSummarize()

  const handleSummarize = async () => {
    if (!content) return
    setIsSummarizing(true)
    setError('')
    try {
      const { summary } = await summarize(content)
      setContent(prev => `${prev}\n\n---\n\nSummary:\n${summary}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Summarization failed')
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (note) {
        await updateNote({ id: note.id, title, content })
      } else {
        await createNote({ title, content })
        // Reset form after successful creation
        setTitle('')
        setContent('')
      }
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Create Note'}</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... rest of the form ... */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleSummarize}
              disabled={isSummarizing || !content}
            >
              {isSummarizing ? 'Summarizing...' : 'Summarize'}
            </Button>
            <Button 
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {note ? (isUpdating ? 'Updating...' : 'Update') : (isCreating ? 'Creating...' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
