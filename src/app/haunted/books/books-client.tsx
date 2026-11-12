"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createBook, updateBook, deleteBook } from "./actions";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: string;
  rating: number | null;
  coverUrl: string | null;
  sortOrder: number;
}

export function BooksClient({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("new") === "true") {
      setIsAdding(true);
      setEditingBook(null);
    }
  }, [searchParams]);

  const resetForm = () => {
    setEditingBook(null);
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Books & Reading List</h1>
          <p className="text-muted-foreground text-sm">
            Manage technical and non-technical books you recommend or are reading.
          </p>
        </div>
        {!isAdding && !editingBook && (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingBook(null);
            }}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm self-start sm:self-auto shrink-0"
          >
            + Add Book
          </button>
        )}
      </div>

      {/* Add / Edit Book Form */}
      {(isAdding || editingBook) && (
        <div className="border-2 border-primary p-6 bg-card mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
            <h2 className="text-lg font-heading font-bold">
              {editingBook ? `Edit: ${editingBook.title}` : "+ Add New Book"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ✕ Close
            </button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsPending(true);
              const formData = new FormData(e.currentTarget);
              try {
                if (editingBook) {
                  await updateBook(editingBook.id, formData);
                } else {
                  await createBook(formData);
                }
                resetForm();
                window.location.reload();
              } catch (err: any) {
                alert(err?.message || "Failed to save book");
              } finally {
                setIsPending(false);
              }
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Book Title *</label>
                <input
                  name="title"
                  required
                  defaultValue={editingBook?.title || ""}
                  placeholder="e.g. Designing Data-Intensive Applications"
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author *</label>
                <input
                  name="author"
                  required
                  defaultValue={editingBook?.author || ""}
                  placeholder="e.g. Martin Kleppmann"
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={editingBook?.status || "Read"}
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
                  defaultValue={editingBook?.rating || ""}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image URL (optional)</label>
                <input
                  name="coverUrl"
                  type="url"
                  defaultValue={editingBook?.coverUrl || ""}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={editingBook?.sortOrder ?? 0}
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 border border-border text-foreground font-medium hover:bg-muted text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-50"
              >
                {isPending ? "Saving..." : editingBook ? "Update Book" : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Books List */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-bold">Current Books ({books.length})</h2>
        {books.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center border border-dashed border-border">
            No books in your list yet. Click &quot;+ Add Book&quot; above to add one.
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
                      {book.rating != null && (
                        <span className="text-xs text-accent font-semibold">
                          ★ {book.rating}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingBook(book);
                      setIsAdding(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-3 py-1 text-xs border border-border text-foreground hover:bg-muted"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${book.title}"?`)) return;
                      try {
                        await deleteBook(book.id);
                        setBooks((prev) => prev.filter((b) => b.id !== book.id));
                      } catch (err: any) {
                        alert(err?.message || "Failed to delete book");
                      }
                    }}
                    className="px-3 py-1 text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10 self-end sm:self-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
