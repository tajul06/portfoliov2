"use client";

import { useState } from "react";
import {
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
} from "./actions";
import { formatYearOnly, formatYearRange } from "@/lib/constants";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  startDate: Date | null;
  endDate: Date | null;
  bullets: string[];
  sortOrder: number;
  visible: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  startDate: Date | null;
  endDate: Date | null;
  details: string | null;
  sortOrder: number;
}

function formatDateForInput(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export function ExperienceManagerClient({
  initialExperiences,
  initialEducations,
}: {
  initialExperiences: ExperienceItem[];
  initialEducations: EducationItem[];
}) {
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);

  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [isAddingEdu, setIsAddingEdu] = useState(false);

  const [isPending, setIsPending] = useState(false);

  return (
    <div className="max-w-4xl space-y-12">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-heading font-bold mb-1">Experience & Education</h1>
        <p className="text-muted-foreground text-sm">
          Manage your professional roles and educational credentials. Any changes immediately update the public site.
        </p>
      </div>

      {/* ── WORK EXPERIENCE ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold">Work & Research Experience ({initialExperiences.length})</h2>
          {!isAddingExp && !editingExp && (
            <button
              onClick={() => setIsAddingExp(true)}
              className="px-4 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
            >
              + Add Experience
            </button>
          )}
        </div>

        {/* Add / Edit Experience Form */}
        {(isAddingExp || editingExp) && (
          <div className="border-2 border-primary p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-bold">
                {editingExp ? `Edit: ${editingExp.role} @ ${editingExp.company}` : "+ Add Work Experience"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingExp(null);
                  setIsAddingExp(false);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsPending(true);
                const formData = new FormData(e.currentTarget);
                try {
                  if (editingExp) {
                    await updateExperience(editingExp.id, formData);
                  } else {
                    await createExperience(formData);
                  }
                  setEditingExp(null);
                  setIsAddingExp(false);
                  window.location.reload();
                } catch (err: any) {
                  alert(err?.message || "Failed to save experience");
                } finally {
                  setIsPending(false);
                }
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Job / Role *</label>
                  <input
                    name="role"
                    required
                    defaultValue={editingExp?.role || ""}
                    placeholder="e.g. Computer Vision Researcher"
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company / Organization *</label>
                  <input
                    name="company"
                    required
                    defaultValue={editingExp?.company || ""}
                    placeholder="e.g. AI & Vision Lab, NSU"
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    name="startDate"
                    type="date"
                    defaultValue={formatDateForInput(editingExp?.startDate || null)}
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date (Leave blank for Present)</label>
                  <input
                    name="endDate"
                    type="date"
                    defaultValue={formatDateForInput(editingExp?.endDate || null)}
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={editingExp ? editingExp.sortOrder : initialExperiences.length}
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bullet Points (one per line)</label>
                <textarea
                  name="bullets"
                  rows={4}
                  defaultValue={editingExp?.bullets?.join("\n") || ""}
                  placeholder="- Led capstone engineering team&#x0a;- Benchmarked 22 PatchCore models achieving 96.8% AUROC"
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="visible_exp"
                  name="visible"
                  type="checkbox"
                  defaultChecked={editingExp ? editingExp.visible : true}
                  className="w-4 h-4"
                />
                <label htmlFor="visible_exp" className="text-sm">Visible on website</label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingExp(null);
                    setIsAddingExp(false);
                  }}
                  className="px-4 py-2 border border-border text-sm hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-50"
                >
                  {isPending ? "Saving..." : editingExp ? "Update Experience" : "Add Experience"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Experiences */}
        <div className="space-y-3">
          {initialExperiences.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 border border-dashed border-border text-center">
              No experience items added yet. Click "+ Add Experience" above to add one.
            </p>
          ) : (
            initialExperiences.map((exp) => (
              <div key={exp.id} className="border border-border p-5 bg-card flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold">{exp.role}</h3>
                    {!exp.visible && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-muted text-muted-foreground border">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {formatYearRange(exp.startDate, exp.endDate)}
                  </p>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-muted-foreground pt-1 space-y-0.5">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingExp(exp);
                      setIsAddingExp(false);
                    }}
                    className="px-3 py-1 text-xs border border-border hover:bg-muted font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete "${exp.role}"?`)) {
                        await deleteExperience(exp.id);
                        window.location.reload();
                      }
                    }}
                    className="px-3 py-1 text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="space-y-6 pt-8 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold">Education ({initialEducations.length})</h2>
          {!isAddingEdu && !editingEdu && (
            <button
              onClick={() => setIsAddingEdu(true)}
              className="px-4 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
            >
              + Add Education
            </button>
          )}
        </div>

        {/* Add / Edit Education Form */}
        {(isAddingEdu || editingEdu) && (
          <div className="border-2 border-primary p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-bold">
                {editingEdu ? `Edit: ${editingEdu.degree}` : "+ Add Education"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingEdu(null);
                  setIsAddingEdu(false);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsPending(true);
                const formData = new FormData(e.currentTarget);
                try {
                  if (editingEdu) {
                    await updateEducation(editingEdu.id, formData);
                  } else {
                    await createEducation(formData);
                  }
                  setEditingEdu(null);
                  setIsAddingEdu(false);
                  window.location.reload();
                } catch (err: any) {
                  alert(err?.message || "Failed to save education");
                } finally {
                  setIsPending(false);
                }
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Institution *</label>
                  <input
                    name="institution"
                    required
                    defaultValue={editingEdu?.institution || ""}
                    placeholder="e.g. North South University"
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Degree / Qualification *</label>
                  <input
                    name="degree"
                    required
                    defaultValue={editingEdu?.degree || ""}
                    placeholder="e.g. B.Sc. in Computer Science & Engineering"
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Graduation / Completion Date (or expected)</label>
                  <input
                    name="endDate"
                    type="date"
                    defaultValue={formatDateForInput(editingEdu?.endDate || null)}
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={editingEdu ? editingEdu.sortOrder : initialEducations.length}
                    className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Details / Relevant Coursework</label>
                <textarea
                  name="details"
                  rows={3}
                  defaultValue={editingEdu?.details || ""}
                  placeholder="e.g. Relevant Coursework: Deep Learning, Computer Vision, Algorithms, DBMS"
                  className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-xs"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEdu(null);
                    setIsAddingEdu(false);
                  }}
                  className="px-4 py-2 border border-border text-sm hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-50"
                >
                  {isPending ? "Saving..." : editingEdu ? "Update Education" : "Add Education"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Education */}
        <div className="space-y-3">
          {initialEducations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 border border-dashed border-border text-center">
              No education items added yet. Click "+ Add Education" above to add one.
            </p>
          ) : (
            initialEducations.map((edu) => (
              <div key={edu.id} className="border border-border p-5 bg-card flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-heading font-bold">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {formatYearOnly(edu.endDate, "Present")}
                  </p>
                  {edu.details && (
                    <p className="text-sm text-muted-foreground pt-1 leading-relaxed">{edu.details}</p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingEdu(edu);
                      setIsAddingEdu(false);
                    }}
                    className="px-3 py-1 text-xs border border-border hover:bg-muted font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete "${edu.degree}"?`)) {
                        await deleteEducation(edu.id);
                        window.location.reload();
                      }
                    }}
                    className="px-3 py-1 text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

