"use client";

import { useState } from "react";
import { createArticle, deleteArticle, togglePublish } from "./actions";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date | string;
}

export function NotebookClient({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setBusyId(id);
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete article");
    } finally {
      setBusyId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setBusyId(id);
    try {
      await togglePublish(id, !currentStatus);
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, published: !currentStatus } : a))
      );
    } catch (err: any) {
      alert(err?.message || "Failed to update article");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Notebook / Articles</h1>
          <p className="text-muted-foreground text-sm">Write, publish, and manage your articles.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm self-start sm:self-auto shrink-0"
          >
            + New Article
          </button>
        )}
      </div>

      {/* New Article Form */}
      {isAdding && (
        <div className="border-2 border-primary p-6 bg-card mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
            <h2 className="text-lg font-heading font-bold">+ New Article</h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
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
                await createArticle(formData);
                setIsAdding(false);
              } catch (err: any) {
                alert(err?.message || "Failed to create article");
              } finally {
                setIsPending(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                name="title"
                required
                placeholder="Article title"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                name="slug"
                required
                placeholder="my-article-slug"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <input
                name="excerpt"
                placeholder="Short description for listing"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content (Markdown supported) *</label>
              <textarea
                name="content"
                required
                rows={10}
                placeholder="Write your article content here..."
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none font-mono text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-border text-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-50"
              >
                {isPending ? "Publishing..." : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 className="text-lg font-heading font-bold mb-3">Articles ({articles.length})</h2>
      <div className="space-y-3">
        {articles.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border">
            <p className="text-muted-foreground">No articles yet. Click &quot;+ New Article&quot; to write one.</p>
          </div>
        ) : (
          articles.map((article) => {
            const isBusy = busyId === article.id;
            return (
              <div
                key={article.id}
                className="border border-border p-4 bg-card flex flex-col sm:flex-row justify-between items-start gap-4"
              >
                <div>
                  <h3 className="font-heading font-bold">{article.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    /{article.slug} • {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                  {article.excerpt && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <span
                    className={`inline-block text-xs px-2 py-0.5 mt-2 ${
                      article.published
                        ? "bg-green-500/20 text-green-600"
                        : "bg-yellow-500/20 text-yellow-600"
                    }`}
                  >
                    {article.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleTogglePublish(article.id, article.published)}
                    className="text-xs border border-border hover:border-primary px-2.5 py-1.5 disabled:opacity-50 font-medium"
                  >
                    {isBusy ? "..." : article.published ? "Unpublish" : "Publish"}
                  </button>
                  <a
                    href={`/notebook/${article.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs border border-border hover:border-primary px-2.5 py-1.5 font-medium"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDelete(article.id, article.title)}
                    className="text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10 px-2.5 py-1.5 disabled:opacity-50 font-medium"
                  >
                    {isBusy ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

