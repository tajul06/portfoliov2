import { prisma } from "@/lib/db";
import { updateProfile } from "./actions";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="max-w-3xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Profile Details</h1>
        <p className="text-muted-foreground text-sm">
          Update your headline, bio, contact details, and social links.
        </p>
      </div>

      <div className="border-2 border-primary p-6 bg-card">
        <form action={updateProfile} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                name="name"
                defaultValue={profile?.name || ""}
                required
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Headline / Role *</label>
              <input
                name="headline"
                defaultValue={profile?.headline || ""}
                required
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio *</label>
            <textarea
              name="bio"
              rows={6}
              defaultValue={profile?.bio || ""}
              required
              className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                name="email"
                type="email"
                defaultValue={profile?.email || ""}
                required
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                name="phone"
                defaultValue={profile?.phone || ""}
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                name="location"
                defaultValue={profile?.location || ""}
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <input
                name="githubUrl"
                type="url"
                defaultValue={profile?.githubUrl || ""}
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
              <input
                name="linkedinUrl"
                type="url"
                defaultValue={profile?.linkedinUrl || ""}
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
