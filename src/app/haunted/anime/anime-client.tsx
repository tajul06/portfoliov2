"use client";

import { useState } from "react";
import { createAnime, updateAnime, deleteAnime } from "./actions";

export interface Anime {
  id: string;
  title: string;
  status: string;
  rating: number | null;
  coverUrl: string | null;
  sortOrder: number;
}

export function AnimeClient({ initialAnime }: { initialAnime: Anime[] }) {
  const [animeList, setAnimeList] = useState<Anime[]>(initialAnime);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const resetForm = () => {
    setEditingAnime(null);
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Anime Tracker</h1>
        <p className="text-muted-foreground text-sm">
          Track and categorize anime you are watching, completed, or plan to watch.
        </p>
      </div>

      {!isAdding && !editingAnime && (
        <div className="mb-8">
          <button
            onClick={() => setIsAdding(true)}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
          >
            + Add Anime
          </button>
        </div>
      )}

      {/* Add / Edit Anime Form */}
      {(isAdding || editingAnime) && (
        <div className="border-2 border-primary p-6 bg-card mb-8">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
            <h2 className="text-lg font-heading font-bold">
              {editingAnime ? `Edit: ${editingAnime.title}` : "Add Anime"}
            </h2>
            <button
              onClick={resetForm}
              className="text-sm text-muted-foreground hover:text-foreground font-medium"
            >
              ✕ Cancel
            </button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsPending(true);
              const formData = new FormData(e.currentTarget);
              try {
                if (editingAnime) {
                  await updateAnime(editingAnime.id, formData);
                } else {
                  await createAnime(formData);
                }
                resetForm();
                window.location.reload();
              } catch (err: any) {
                alert(err?.message || "Failed to save anime");
              } finally {
                setIsPending(false);
              }
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Anime Title *</label>
                <input
                  name="title"
                  required
                  defaultValue={editingAnime?.title || ""}
                  placeholder="e.g. Frieren: Beyond Journey's End"
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={editingAnime?.status || "Completed"}
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                >
                  <option value="Watching">Watching</option>
                  <option value="Completed">Completed</option>
                  <option value="Plan to Watch">Plan to Watch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1-10)</label>
                <input
                  name="rating"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={editingAnime?.rating || ""}
                  placeholder="e.g. 9"
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                <input
                  name="coverUrl"
                  type="url"
                  defaultValue={editingAnime?.coverUrl || ""}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={editingAnime?.sortOrder ?? 0}
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
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
                {isPending ? "Saving..." : editingAnime ? "Update Anime" : "Add Anime"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Anime List */}
      <div className="space-y-6">
        <h2 className="text-lg font-heading font-bold">Anime ({animeList.length})</h2>
        {animeList.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center border border-dashed border-border text-sm">
            No anime in your list yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {animeList.map((anime) => (
              <div
                key={anime.id}
                className="border border-border p-4 bg-card flex items-start justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {anime.coverUrl ? (
                    <img
                      src={anime.coverUrl}
                      alt={anime.title}
                      className="w-14 h-20 object-cover border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-20 bg-muted flex items-center justify-center text-[10px] font-mono text-muted-foreground border border-border flex-shrink-0">
                      No Pic
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading font-bold text-sm">{anime.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-muted text-muted-foreground">
                        {anime.status}
                      </span>
                      {anime.rating && (
                        <span className="text-xs text-accent font-semibold">
                          ★ {anime.rating}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    onClick={() => {
                      setEditingAnime(anime);
                      setIsAdding(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-2.5 py-1 text-xs border border-border text-foreground hover:bg-muted"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${anime.title}"?`)) return;
                      try {
                        await deleteAnime(anime.id);
                        setAnimeList((prev) => prev.filter((a) => a.id !== anime.id));
                      } catch (err: any) {
                        alert(err?.message || "Failed to delete anime");
                      }
                    }}
                    className="px-2.5 py-1 text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10"
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