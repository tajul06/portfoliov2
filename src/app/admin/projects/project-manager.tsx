"use client";

import { useState } from "react";
import { createProject, updateProject, deleteProject } from "./actions";
import { VideoPlayer } from "@/components/video-player";

interface Project {
  id: string;
  name: string;
  description: string;
  link: string | null;
  repoUrl: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  tags: string[];
  sortOrder: number;
  visible: boolean;
}

export function ProjectManager({ initialProjects }: { initialProjects: Project[] }) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>("");
  const [isPending, setIsPending] = useState(false);

  const resetForm = () => {
    setEditingProject(null);
    setIsAdding(false);
    setPreviewVideoUrl("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Projects Management</h1>
          <p className="text-muted-foreground text-sm">
            Add and update portfolio projects with GitHub repos and embedded demo videos.
          </p>
        </div>
        {!isAdding && !editingProject && (
          <button
            onClick={() => {
              setIsAdding(true);
              setPreviewVideoUrl("");
            }}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
          >
            + New Project
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal / Box */}
      {(isAdding || editingProject) && (
        <div className="border-2 border-primary bg-card p-6 mb-10">
          <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
            <h2 className="text-xl font-heading font-bold">
              {editingProject ? `Edit: ${editingProject.name}` : "Create New Project"}
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
                if (editingProject) {
                  await updateProject(editingProject.id, formData);
                } else {
                  await createProject(formData);
                }
                resetForm();
              } catch (err: any) {
                alert(err?.message || "Failed to save project");
              } finally {
                setIsPending(false);
              }
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name *</label>
                <input
                  name="name"
                  defaultValue={editingProject?.name || ""}
                  required
                  placeholder="e.g. Fabric Inspection System"
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  name="tags"
                  defaultValue={editingProject?.tags?.join(", ") || ""}
                  placeholder="Python, YOLO, PyTorch, Flask"
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                rows={5}
                defaultValue={editingProject?.description || ""}
                required
                placeholder="Details about problem solved, architecture, and metrics..."
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none font-mono text-sm"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Repository URL</label>
                <input
                  name="repoUrl"
                  type="url"
                  defaultValue={editingProject?.repoUrl || ""}
                  placeholder="https://github.com/tajul06/..."
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Live Demo / Product Link</label>
                <input
                  name="link"
                  type="url"
                  defaultValue={editingProject?.link || ""}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Demo Video URL (YouTube, Vimeo, or MP4)
                </label>
                <input
                  name="videoUrl"
                  type="url"
                  value={previewVideoUrl !== "" ? previewVideoUrl : editingProject?.videoUrl || ""}
                  onChange={(e) => setPreviewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Will embed directly on the project&apos;s public page.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={editingProject?.sortOrder ?? 0}
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
                />
              </div>
            </div>

            {(previewVideoUrl || editingProject?.videoUrl) && (
              <div className="border border-border p-3 bg-muted/30">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                  Video Preview:
                </p>
                <div className="max-w-md">
                  <VideoPlayer url={previewVideoUrl || editingProject?.videoUrl || ""} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="visible"
                name="visible"
                defaultChecked={editingProject ? editingProject.visible : true}
                className="w-4 h-4 border border-border"
              />
              <label htmlFor="visible" className="text-sm font-medium cursor-pointer">
                Visible on public site
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-50"
              >
                {isPending ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 border border-border text-foreground font-medium hover:bg-muted text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {initialProjects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border">
            <p className="text-muted-foreground">No projects found. Add your first project above.</p>
          </div>
        ) : (
          initialProjects.map((project) => (
            <div
              key={project.id}
              className="border-2 border-border p-5 bg-card flex flex-col md:flex-row justify-between gap-4 items-start md:items-center hover:border-primary transition-none"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="font-heading font-bold text-lg">{project.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 font-mono ${
                      project.visible
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {project.visible ? "PUBLIC" : "HIDDEN"}
                  </span>
                  {project.videoUrl && (
                    <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent border border-accent/30 font-mono">
                      VIDEO
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-muted px-2 py-0.5 font-mono text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                <button
                  onClick={() => {
                    setEditingProject(project);
                    setPreviewVideoUrl(project.videoUrl || "");
                    setIsAdding(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-3.5 py-1.5 border border-border text-sm font-medium hover:bg-muted"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
                      await deleteProject(project.id);
                    }
                  }}
                  className="px-3.5 py-1.5 border border-red-500/40 text-red-600 text-sm font-medium hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
