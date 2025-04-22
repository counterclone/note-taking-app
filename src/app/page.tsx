'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NoteEditor } from '@/components/note-editor'
import { useNotes, useDeleteNote } from '@/lib/queries/notes'
import { useAuth } from '@/providers/auth-provider'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: notes, isLoading, isError } = useNotes()
  const { user, signOut } = useAuth()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<{ id: string; title: string; content: string } | null>(null)
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote()
  const router = useRouter()

  if (!user) {
    router.push('/login')
    return null
  }

  const handleEdit = (note: { id: string; title: string; content: string }) => {
    setEditingNote(note)
    setEditorOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id)
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Notes App</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Notes</h2>
          <Button onClick={() => {
            setEditingNote(null)
            setEditorOpen(true)
          }}>
            Create Note
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : isError ? (
          <div className="text-red-500">Error loading notes</div>
        ) : notes?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            You don't have any notes yet. Create your first note!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes?.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="truncate">{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-4 mb-4 whitespace-pre-line">
                    {note.content}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(note)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
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
          setEditorOpen(open)
          if (!open) setEditingNote(null)
        }}
        note={editingNote || undefined}
      />
    </div>
  )
}
