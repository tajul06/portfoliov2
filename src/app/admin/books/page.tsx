import { prisma } from "@/lib/db";
import { createBook, deleteBook } from "./actions";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Books & Reading List</h1>
        <p className="text-muted-foreground text-sm">
          Manage technical and non-technical books you recommend or are reading.
        </p>
      </div>

      {/* Add New Book Form */}
      <div className="border-2 border-primary p-6 bg-card mb-8">
        <h2 className="text-lg font-heading font-bold mb-4">+ Add Book</h2>
        <form action={createBook} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Book Title *</label>
              <input
                name="title"
                required
                placeholder="e.g. Designing Data-Intensive Applications"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author *</label>
              <input
                name="author"
                required
                placeholder="e.g. Martin Kleppmann"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                defaultValue="Read"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              >
                <option value="Reading">Reading</option>
                <option value="Read">Read</option>
                <option value="Want to Read">Want to Read</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating (1-10)</label>
              <input
                name="rating"
                type="number"
                min="1"
                max="10"
                placeholder="e.g. 10"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cover Image URL (optional)</label>
              <input
                name="coverUrl"
                type="url"
                placeholder="https://..."
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>

      {/* Books List */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-bold">Current Books ({books.length})</h2>

        {books.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center border border-dashed border-border">
            No books in your list yet.
          </p>
        ) : (
          <div className="border border-border divide-y divide-border bg-card">
            {books.map((book) => (
              <div
                key={book.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover border border-border"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground border border-border">
                      Book
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading font-bold">{book.title}</h3>
                    <p className="text-xs text-muted-foreground">by {book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono px-2 py-0.5 bg-muted text-muted-foreground">
                        {book.status}
                      </span>
                      {book.rating && (
                        <span className="text-xs text-accent font-semibold">
                          ★ {book.rating}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <form
                  action={async () => {
                    "use server";
                    await deleteBook(book.id);
                  }}
                >
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10 self-end sm:self-center"
                  >
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
