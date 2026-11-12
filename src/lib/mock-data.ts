// Mock data for local testing (no database required)
// Remove this file when connecting to Supabase

export const mockProfile = {
  id: "1",
  name: "Md Tajul Islam",
  headline: "Software Developer",
  bio: `I'm a software developer specializing in ML/AI, web systems, Flask apps, and RAG systems.

Over time, I found my true passion in practical machine learning and web systems. I started building local-first AI tools, Flask applications, and data-driven prototypes. Through hands-on experience in model training, inspection workflows, and privacy-preserving RAG systems, I am constantly trying to push my limits. Every new project is a step forward in turning my ideas into reality.`,
  photoUrl: null,
  email: "md.tajul2000@gmail.com",
  githubUrl: "https://github.com/tajul06",
  linkedinUrl: "https://linkedin.com/in/tajul06/",
  location: "Dhaka, Bangladesh",
  phone: "+880 1535 209226",
};

export const mockProjects = [
  {
    id: "1",
    name: "Fabric Inspection Prototype",
    description: `Computer vision system for automated fabric defect detection using YOLO models. Built as my BSc thesis project (CSE499).

Key features:
- Real-time defect detection on fabric production lines
- Custom YOLO model trained on fabric defect dataset
- Integration with industrial camera systems
- Web dashboard for inspection analytics

Achieved 94% accuracy on defect classification with <100ms inference time.`,
    link: null,
    repoUrl: "https://github.com/tajul06/fabric-inspection",
    tags: ["Python", "YOLO", "Computer Vision", "PyTorch", "Flask"],
    imageUrl: null,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder - replace with actual demo
    sortOrder: 0,
    visible: true,
  },
  {
    id: "2",
    name: "TalkBuddy",
    description: `Privacy-first AI chatbot with local LLM support. Built with LangChain and RAG architecture.

Features:
- Runs entirely offline with local LLMs
- Document ingestion with vector search
- Multi-turn conversation support
- No data leaves your machine

Designed for sensitive documents and private conversations.`,
    link: "https://github.com/tajul06/talkbuddy",
    repoUrl: "https://github.com/tajul06/talkbuddy",
    tags: ["Python", "LangChain", "RAG", "LLM", "Privacy"],
    imageUrl: null,
    videoUrl: null,
    sortOrder: 1,
    visible: true,
  },
  {
    id: "3",
    name: "AI Sense",
    description: `Intelligent document processing system with automated categorization and extraction.

Capabilities:
- PDF/document parsing with OCR
- Automatic categorization using NLP
- Entity extraction and knowledge graph generation
- Searchable document archive

Used for processing research papers and technical documentation.`,
    link: null,
    repoUrl: "https://github.com/tajul06/ai-sense",
    tags: ["Python", "NLP", "OCR", "Document AI"],
    imageUrl: null,
    videoUrl: null,
    sortOrder: 2,
    visible: true,
  },
];

export const mockExperience: Array<{
  id: string;
  role: string;
  company: string;
  startDate: Date | null;
  endDate: Date | null;
  bullets: string[];
  sortOrder: number;
  visible: boolean;
}> = [];

export const mockSkills = [
  { id: "1", name: "Python", group: "Languages", sortOrder: 0 },
  { id: "2", name: "SQL", group: "Languages", sortOrder: 1 },
  { id: "3", name: "PyTorch", group: "Deep Learning", sortOrder: 2 },
  { id: "4", name: "YOLO", group: "Computer Vision", sortOrder: 3 },
  { id: "5", name: "LangChain", group: "LLM/NLP", sortOrder: 4 },
  { id: "6", name: "RAG", group: "LLM/NLP", sortOrder: 5 },
  { id: "7", name: "Flask", group: "Web Development", sortOrder: 6 },
  { id: "8", name: "React", group: "Web Development", sortOrder: 7 },
  { id: "9", name: "Next.js", group: "Web Development", sortOrder: 8 },
];

export const mockHobbies = [
  { id: "1", name: "Coding Side Projects", icon: "💻", sortOrder: 0 },
  { id: "2", name: "Reading Tech Blogs", icon: "📚", sortOrder: 1 },
  { id: "3", name: "Watching Anime", icon: "🎬", sortOrder: 2 },
  { id: "4", name: "Playing Chess", icon: "♟️", sortOrder: 3 },
];

export const mockAnime = [
  {
    id: "1",
    title: "Attack on Titan",
    status: "Completed",
    rating: 10,
    coverUrl: null,
    sortOrder: 0,
  },
  {
    id: "2",
    title: "Demon Slayer",
    status: "Completed",
    rating: 9,
    coverUrl: null,
    sortOrder: 1,
  },
  {
    id: "3",
    title: "Jujutsu Kaisen",
    status: "Watching",
    rating: null,
    coverUrl: null,
    sortOrder: 2,
  },
  {
    id: "4",
    title: "One Punch Man",
    status: "Plan to Watch",
    rating: null,
    coverUrl: null,
    sortOrder: 3,
  },
];

export const mockBooks = [
  {
    id: "1",
    title: "Deep Learning",
    author: "Ian Goodfellow",
    status: "Read",
    rating: 9,
    coverUrl: null,
    sortOrder: 0,
  },
  {
    id: "2",
    title: "Hands-On Machine Learning",
    author: "Aurélien Géron",
    status: "Read",
    rating: 10,
    coverUrl: null,
    sortOrder: 1,
  },
  {
    id: "3",
    title: "Designing Machine Learning Systems",
    author: "Chip Huyen",
    status: "Reading",
    rating: null,
    coverUrl: null,
    sortOrder: 2,
  },
  {
    id: "4",
    title: "Clean Code",
    author: "Robert C. Martin",
    status: "Want to Read",
    rating: null,
    coverUrl: null,
    sortOrder: 3,
  },
];
