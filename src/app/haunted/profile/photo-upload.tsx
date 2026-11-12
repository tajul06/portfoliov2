"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface PhotoUploadProps {
  currentPhotoUrl: string | null;
  onUploadComplete: (url: string) => void;
}

export function PhotoUpload({ currentPhotoUrl, onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isUrlMode, setIsUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(
          `${uploadError.message}. Tip: You can also switch to 'Image URL' below to paste any direct image link.`
        );
      }

      const { data: urlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        onUploadComplete(urlData.publicUrl);
        setPreview(null);
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onUploadComplete(urlInput.trim());
    setUrlInput("");
    setIsUrlMode(false);
    setError(null);
  };

  const handleRemove = () => {
    onUploadComplete("");
    setPreview(null);
  };

  const displayUrl = preview || currentPhotoUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold font-heading">Profile Photo</label>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsUrlMode(false)}
            className={`px-2.5 py-1 border ${
              !isUrlMode
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setIsUrlMode(true)}
            className={`px-2.5 py-1 border ${
              isUrlMode
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Preview Frame */}
        <div className="shrink-0">
          {displayUrl ? (
            <div className="relative w-28 h-28 border-4 border-primary bg-muted overflow-hidden">
              <img
                src={displayUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
                onError={() => setError("Could not load image from URL")}
              />
              {uploading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-28 h-28 bg-muted border-4 border-dashed border-border flex items-center justify-center text-center p-2">
              <span className="text-xs text-muted-foreground font-mono">No Photo Set</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-3 w-full">
          {!isUrlMode ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {uploading ? "Uploading to Supabase..." : currentPhotoUrl ? "Change Image" : "Upload Image"}
                </button>
                {currentPhotoUrl && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={uploading}
                    className="px-3 py-2 border border-red-500/40 text-red-600 text-sm hover:bg-red-500/10"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Uploads directly to your Supabase Storage bucket. Recommended: 400x400px square.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplyUrl} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://github.com/tajul06.png"
                  className="flex-1 px-3 py-1.5 border border-border bg-background focus:border-primary outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Paste any publicly accessible image link (e.g. GitHub avatar, Cloudinary, etc.)
              </p>
            </form>
          )}

          {error && (
            <p className="text-xs text-red-600 border border-red-500/30 bg-red-500/10 p-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
