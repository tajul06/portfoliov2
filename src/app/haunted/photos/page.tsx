import { prisma } from "@/lib/db";
import { createPhoto, deletePhoto } from "./actions";

export default async function AdminPhotosPage() {
  const photos = await prisma.photoAlbum.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Photo Album</h1>
        <p className="text-muted-foreground text-sm">Manage your personal photo collection.</p>
      </div>

      <div className="border-2 border-primary p-6 bg-card mb-8">
        <h2 className="text-lg font-heading font-bold mb-4">+ Add Photo</h2>
        <form action={createPhoto} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title *</label><input name="title" required placeholder="Photo title" className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Image URL *</label><input name="imageUrl" required placeholder="https://..." className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Caption</label><input name="caption" placeholder="Photo caption" className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" rows={2} placeholder="Longer description" className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm" /></div>
          <div className="flex justify-end"><button type="submit" className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm">Add Photo</button></div>
        </form>
      </div>

      <h2 className="text-lg font-heading font-bold mb-3">Photos ({photos.length})</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {photos.map((photo) => (
          <div key={photo.id} className="border border-border p-4 bg-card">
            <img src={photo.imageUrl} alt={photo.title} className="w-full h-48 object-cover mb-3 border border-border" />
            <h3 className="font-heading font-bold">{photo.title}</h3>
            {photo.caption && <p className="text-xs text-muted-foreground">{photo.caption}</p>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await deletePhoto(photo.id);
                window.location.reload();
              }}
              className="mt-2"
            >
              <button
                type="submit"
                className="text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10 px-2 py-1"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
