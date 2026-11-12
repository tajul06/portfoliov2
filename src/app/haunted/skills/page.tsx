import { prisma } from "@/lib/db";
import { createSkill, deleteSkill } from "./actions";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });

  // Group by category
  const grouped: Record<string, typeof skills> = {};
  skills.forEach((s) => {
    if (!grouped[s.group]) grouped[s.group] = [];
    grouped[s.group].push(s);
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Skills Management</h1>
        <p className="text-muted-foreground text-sm">
          Add, edit, or remove technical skills organized by category.
        </p>
      </div>

      <div className="border-2 border-primary p-6 bg-card mb-8">
        <h2 className="text-lg font-heading font-bold mb-4">+ Add Skill</h2>
        <form action={createSkill} className="grid gap-4 md:grid-cols-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Skill Name *</label>
            <input name="name" required placeholder="e.g. React, PyTorch" className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select name="group" required className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm">
              <option value="">Select category</option>
              <option value="Languages">Languages</option>
              <option value="Deep Learning">Deep Learning</option>
              <option value="Computer Vision">Computer Vision</option>
              <option value="LLM/NLP">LLM/NLP</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="Databases">Databases</option>
              <option value="Tools">Tools</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input name="sortOrder" type="number" defaultValue={skills.length} className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm" />
          </div>
          <div className="md:col-span-4 flex justify-end pt-2">
            <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm">Add Skill</button>
          </div>
        </form>
      </div>

      <h2 className="text-lg font-heading font-bold mb-3">Skills ({skills.length})</h2>
      {Object.keys(grouped).length === 0 ? (
        <p className="text-muted-foreground py-6 text-center border border-dashed border-border text-sm">No skills added yet.</p>
      ) : (
        Object.entries(grouped).map(([group, groupSkills]) => (
          <div key={group} className="border border-border p-5 bg-card mb-4">
            <h3 className="font-heading font-bold text-base mb-3 text-accent">{group}</h3>
            <div className="flex flex-wrap gap-2">
              {groupSkills.map((skill) => (
                <span key={skill.id} className="inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-background text-sm">
                  {skill.name}
                  <form action={async () => { "use server"; await deleteSkill(skill.id); }} className="inline">
                    <button type="submit" className="text-red-500 hover:text-red-700 text-xs">✕</button>
                  </form>
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}