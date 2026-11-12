"use client";

import { useState } from "react";
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

  const resetForm = () => {
    setEditingHobby(null);
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Hobbies Management</h1>
        <p className="text-muted-foreground text-sm">
          Manage your personal hobbies and interests displayed on the public site.
        </p>
      </div>

      {/* Add / Edit Hobby Form */}
      {(isAdding || editingHobby) && (
        <div className="border-2 border-primary p-6 bg-card mb-8">
          <h2 className="text-lg font-heading font-bold mb-4">
            {editingHobby ? `Edit: ${editingHobby.name}` : "+ Add New Hobby"}
          </h2>
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
      <div className="space-y-3">
        <h2 className="text-lg font-heading font-bold mb-3">Current Hobbies ({hobbies.length})</h2>
        {hobbies.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center border border-dashed border-border">
            No hobbies added yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {hobbies.map((hobby) => (
              <div
                key={hobby.id}
                className="flex items-center justify-between p-4 border border-border bg-card hover:border-primary"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{hobby.icon || "🎯"}</span>
                  <div>
                    <h3 className="font-heading font-bold text-base">{hobby.name}</h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      Order: {hobby.sortOrder}
                    </span>
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