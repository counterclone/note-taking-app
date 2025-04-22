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
      <header className="shadow-md backdrop-blur-lg border-b border-white/20 bg-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-white drop-shadow-md">
            Notes App
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white/70">{user.email}</span>
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="text-white border-white/20 hover:bg-white/10"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white drop-shadow-md">
            Your Notes
          </h2>
          <Button
            onClick={() => {
              setEditingNote(null);
              setEditorOpen(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Create Note
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-400">
            Failed to load notes. Please try again.
          </div>
        ) : notes?.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            You do not have any notes yet. Create your first note!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes?.map((note) => (
              <Card
                key={note.id}
                className="hover:shadow-lg transition-shadow flex flex-col bg-white/10 backdrop-blur-md border border-white/20 text-white"
              >
                <CardHeader>
                  <CardTitle className="truncate text-white">
                    {note.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow overflow-auto mb-4">
                    <pre className="whitespace-pre-wrap font-sans text-white/70">
                      {note.content}
                    </pre>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(note)}
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700 text-white"
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
