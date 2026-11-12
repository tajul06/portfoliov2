"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createHobby, updateHobby, deleteHobby } from "./actions";

export interface Hobby {
  id: string;
  name: string;
  icon: string | null;
  sortOrder: number;
}

export function HobbiesClient({ initialHobbies }: { initialHobbies: Hobby[] }) {
  const [hobbies, setHobbies] = useState<Hobby[]>(initialHobbies);
  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("new") === "true") {
      setIsAdding(true);
      setEditingHobby(null);
    }
  }, [searchParams]);

  const resetForm = () => {
    setEditingHobby(null);
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Hobbies Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage your personal hobbies and interests displayed on the public site.
          </p>
        </div>
        {!isAdding && !editingHobby && (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingHobby(null);
            }}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm self-start sm:self-auto shrink-0"
          >
            + Add Hobby
          </button>
        )}
      </div>

      {/* Add / Edit Hobby Form */}
      {(isAdding || editingHobby) && (
        <div className="border-2 border-primary p-6 bg-card mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
            <h2 className="text-lg font-heading font-bold">
              {editingHobby ? `Edit: ${editingHobby.name}` : "+ Add New Hobby"}
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
                if (editingHobby) {
                  await updateHobby(editingHobby.id, formData);
                } else {
                  await createHobby(formData);
                }
                resetForm();
                window.location.reload();
              } catch (err: any) {
                alert(err?.message || "Failed to save hobby");
              } finally {
                setIsPending(false);
              }
            }}
            className="grid gap-4 md:grid-cols-4 items-end"
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Hobby Name *</label>
              <input
                name="name"
                required
                defaultValue={editingHobby?.name || ""}
                placeholder="e.g. Photography, Playing Guitar"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon / Emoji</label>
              <input
                name="icon"
                defaultValue={editingHobby?.icon || "🎯"}
                placeholder="e.g. 📷, 🎸, 🏃"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input
                name="sortOrder"
                type="number"
                defaultValue={editingHobby?.sortOrder ?? 0}
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div className="md:col-span-4 flex justify-end pt-2 gap-2">
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
                {isPending ? "Saving..." : editingHobby ? "Update Hobby" : "Add Hobby"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hobbies List */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-bold">Current Hobbies ({hobbies.length})</h2>
        {hobbies.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center border border-dashed border-border">
            No hobbies added yet. Click &quot;+ Add Hobby&quot; above to add one.
          </p>
        ) : (
          <div className="border border-border divide-y divide-border bg-card">
            {hobbies.map((hobby) => (
              <div
                key={hobby.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-muted/60 border border-border rounded-lg">
                    {hobby.icon || "🎯"}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold">{hobby.name}</h3>
                    <p className="text-xs text-muted-foreground">Order: {hobby.sortOrder}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingHobby(hobby);
                      setIsAdding(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-3 py-1 text-xs border border-border text-foreground hover:bg-muted"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${hobby.name}"?`)) return;
                      try {
                        await deleteHobby(hobby.id);
                        setHobbies((prev) => prev.filter((h) => h.id !== hobby.id));
                      } catch (err: any) {
                        alert(err?.message || "Failed to delete hobby");
                      }
                    }}
                    className="px-3 py-1 text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10"
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
