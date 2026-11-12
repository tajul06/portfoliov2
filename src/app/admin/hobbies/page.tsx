import { prisma } from "@/lib/db";
import { createHobby, deleteHobby } from "./actions";

export default async function AdminHobbiesPage() {
  const hobbies = await prisma.hobby.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Hobbies Management</h1>
        <p className="text-muted-foreground text-sm">
          Manage your personal hobbies and interests displayed on the public site.
        </p>
      </div>

      {/* Add New Hobby Form */}
      <div className="border-2 border-primary p-6 bg-card mb-8">
        <h2 className="text-lg font-heading font-bold mb-4">+ Add New Hobby</h2>
        <form action={createHobby} className="grid gap-4 md:grid-cols-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Hobby Name *</label>
            <input
              name="name"
              required
              placeholder="e.g. Photography, Playing Guitar"
              className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon / Emoji</label>
            <input
              name="icon"
              placeholder="e.g. 📷, 🎸, 🏃"
              defaultValue="🎯"
              className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={hobbies.length}
              className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
            />
          </div>
          <div className="md:col-span-4 flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
            >
              Add Hobby
            </button>
          </div>
        </form>
      </div>

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
                <form
                  action={async () => {
                    "use server";
                    await deleteHobby(hobby.id);
                  }}
                >
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10"
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
