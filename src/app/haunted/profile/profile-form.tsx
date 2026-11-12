"use client";

import { useState } from "react";
import { updateProfile } from "./actions";
import { PhotoUpload } from "./photo-upload";

interface Profile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  photoUrl: string | null;
  email: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  discordUrl?: string | null;
  facebookUrl?: string | null;
  resumeUrl?: string | null;
  location: string | null;
  phone: string | null;
}

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [photoUrl, setPhotoUrl] = useState<string>(profile?.photoUrl || "");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set("photoUrl", photoUrl);

    try {
      await updateProfile(formData);
      setStatusMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err?.message || "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Profile Details</h1>
        <p className="text-muted-foreground text-sm">
          Update your headline, bio, contact details, social links, and profile picture.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 mb-6 border text-sm ${
            statusMessage.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
              : "border-red-500/40 bg-red-500/10 text-red-600"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Photo Upload Section */}
      <div className="border-2 border-primary p-6 bg-card mb-6">
        <PhotoUpload
          currentPhotoUrl={photoUrl || null}
          onUploadComplete={(url) => {
            setPhotoUrl(url);
            setStatusMessage({ type: "success", text: url ? "Photo uploaded! Click Save Profile to apply." : "Photo removed." });
          }}
        />
      </div>

      {/* Profile Form */}
      <div className="border-2 border-border p-6 bg-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="photoUrl" value={photoUrl} />

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

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Discord URL or Handle</label>
              <input
                name="discordUrl"
                defaultValue={profile?.discordUrl || ""}
                placeholder="e.g. https://discord.com/users/... or handle"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Facebook URL</label>
              <input
                name="facebookUrl"
                type="url"
                defaultValue={profile?.facebookUrl || ""}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Resume / CV Link (PDF)</label>
              <input
                name="resumeUrl"
                type="url"
                defaultValue={profile?.resumeUrl || ""}
                placeholder="https://.../resume.pdf"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
