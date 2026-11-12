import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create profile
  await prisma.profile.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      name: "Md Tajul Islam",
      headline: "Software Developer",
      bio: `I'm a software developer specializing in ML/AI, web systems, Flask apps, and RAG systems.

Over time, I found my true passion in practical machine learning and web systems. I started building local-first AI tools, Flask applications, and data-driven prototypes. Through hands-on experience in model training, inspection workflows, and privacy-preserving RAG systems, I am constantly trying to push my limits. Every new project is a step forward in turning my ideas into reality.`,
      email: "md.tajul2000@gmail.com",
      githubUrl: "https://github.com/tajul06",
      linkedinUrl: "https://linkedin.com/in/tajul06/",
      location: "Dhaka, Bangladesh",
      phone: "+880 1535 209226",
    },
  });

  // Clean up and recreate projects
  await prisma.project.deleteMany({});
  await prisma.project.createMany({
    data: [
      {
        name: "TalkBuddy",
        description: `Real-time conversational voice agent powered by local open-source AI. Ultra-low-latency voice conversations (~3 seconds time-to-first-audio) with GPU-accelerated execution on AMD Radeon via Vulkan. No cloud dependencies, no API keys.

**Performance** (AMD Ryzen 5 3600 + RX 5600 XT):
- STT (Whisper small GPU): 260-450ms
- LLM First Token (Llama 3.2 3B): 620-950ms
- TTS (Kokoro-82M): 100-180ms
- Total TTFA: 2.8-3.5 seconds`,
        overview: JSON.stringify({
          problem: "Cloud-based voice assistants suffer from latency bottlenecks and raise serious privacy concerns by transmitting private audio over the internet.",
          solution: "A 100% local-first conversational voice agent running entirely on consumer hardware (AMD Vulkan GPU) with ~3s time-to-first-audio.",
          features: [
            "Local GPU-accelerated STT via whisper.cpp with Vulkan offload",
            "Streaming local LLM responses using Llama 3.2 3B",
            "High-quality local TTS with Kokoro-82M",
            "Three-layer persistent memory system (turns, session summaries, facts)",
          ],
        }),
        challenges: JSON.stringify({
          // NOTE TO USER: Replace placeholders with specific project claims/numbers
          pairs: [
            {
              challenge: "<REPLACE: specific problem, e.g. High latency in CPU fallback speech synthesis>",
              resolution: "<REPLACE: specific fix and measurable result, e.g. Ported execution to Vulkan GPU compute, bringing TTFA under 3 seconds>",
            },
          ],
        }),
        architecture: JSON.stringify({
          stages: [
            {
              title: "1. Audio Input",
              items: [
                "Microphone capture -> Web Audio API",
                "Silero VAD v5 for speech endpoint detection",
                "Binary audio frames streamed over WebSocket",
              ],
            },
            {
              title: "2. Speech-to-Text",
              items: [
                "whisper.cpp with Vulkan GPU offloading",
                "Faster-whisper fallback for CPU-only machines",
                "260-450ms latency on Whisper small GPU",
              ],
            },
            {
              title: "3. LLM Reasoning",
              items: [
                "Llama 3.2 3B via external llama-server on :8080",
                "-ngl -1 flag for full Vulkan GPU offload",
                "620-950ms time to first token",
                "Three-layer memory: short-term, summaries, long-term facts",
              ],
            },
            {
              title: "4. Text-to-Speech",
              items: [
                "Kokoro-82M TTS at 24kHz",
                "Multi-voice support (af_heart, af_sky, af_bella, and more)",
                "100-180ms synthesis latency",
              ],
            },
            {
              title: "5. Output & API",
              items: [
                "Binary audio frames streamed to speaker",
                "REST API: /health, /voice/chat, /text/chat, /text/chat/stream",
                "Session and memory management endpoints",
              ],
            },
          ],
          techStack: ["Python", "FastAPI", "React", "Vulkan", "Whisper.cpp", "Llama.cpp", "Voice AI", "WebSocket"],
        }),
        repoUrl: "https://github.com/tajul06/talkbuddy",
        tags: ["Python", "FastAPI", "React", "Vulkan", "Whisper.cpp", "Llama.cpp", "Voice AI", "WebSocket"],
        sortOrder: 0,
        visible: true,
      },
      {
        name: "AI Sensei",
        description: `Authenticated PDF study assistant with Retrieval-Augmented Generation (RAG) for intelligent document Q&A. Built with LangChain, Pinecone vector database, and Google Gemini. Live at https://ai-sensei-lime.vercel.app.`,
        overview: JSON.stringify({
          problem: "Students waste time searching long PDFs for answers, and general chatbots answer without grounding in the student's own material.",
          solution: "An authenticated study assistant: upload PDFs per subject, ask questions, and get answers grounded only in your documents, streamed live with proper math rendering.",
          features: [
            "Per-user, per-subject isolated knowledge base",
            "Two-stage retrieval: dense search + cross-encoder reranking",
            "Token-by-token streaming responses",
            "Google/email auth and persistent chat history",
          ],
          liveUrl: "https://ai-sensei-lime.vercel.app",
        }),
        challenges: JSON.stringify({
          // NOTE TO USER: Replace placeholders with specific project claims/numbers
          pairs: [
            {
              challenge: "<REPLACE: specific problem, e.g. High latency during multi-page PDF embedding and retrieval>",
              resolution: "<REPLACE: specific fix and measurable result, e.g. Implemented recursive chunking with Jina cross-encoder reranking, reducing irrelevant chunk injection by 40%>",
            },
          ],
        }),
        link: "https://ai-sensei-lime.vercel.app",
        architecture: JSON.stringify({
          stages: [
            {
              title: "1. Document Ingestion",
              items: [
                "PDF text extraction with PyMuPDF",
                "RecursiveCharacterTextSplitter chunking (chunk_size=1000, chunk_overlap=200)",
                "Embeddings: sentence-transformers/all-MiniLM-L6-v2",
                "Vector storage: Pinecone (namespaced per user + subject)",
              ],
            },
            {
              title: "2. Retrieval & Reranking",
              items: [
                "Dense vector retrieval from Pinecone (top-k=10)",
                "Jina AI reranker (jinaai/jina-reranker-v2-base-multilingual)",
                "Cross-encoder reranking for improved precision",
              ],
            },
            {
              title: "3. Generation",
              items: [
                "Google Gemini 1.5 Flash for response synthesis",
                "LCEL chain: retrieval -> rerank -> format context -> generate",
                "Token-by-token streaming from FastAPI to React frontend",
              ],
            },
            {
              title: "4. Auth & Storage",
              items: [
                "Supabase email/Google OAuth",
                "Session history persisted in Supabase PostgreSQL",
                "Markdown + GFM + KaTeX math rendering in chat UI",
              ],
            },
          ],
          techStack: ["FastAPI", "LangChain (LCEL)", "Pinecone", "Google Gemini", "Jina AI", "React", "TypeScript", "Supabase"],
        }),
        repoUrl: "https://github.com/tajul06/AI-Sensei",
        tags: ["Python", "FastAPI", "React", "LangChain", "RAG", "Pinecone", "Gemini", "TypeScript"],
        sortOrder: 1,
        visible: true,
      },
      {
        name: "EduChat",
        description: `Offline educational assistant chatbot for students without internet access. Built with Flask, FAISS vector database, and Sentence-Transformers for local semantic search. CSE299 project.`,
        architecture: JSON.stringify({
          stages: [
            {
              title: "1. Document Ingestion",
              items: [
                "Sliding-window chunking with token overlap (preserves context across boundaries)",
                "sentence-transformers/all-MiniLM-L6-v2 embeddings (384-dim)",
                "FAISS IndexFlatIP for cosine similarity search",
              ],
            },
            {
              title: "2. Retrieval",
              items: [
                "Query embedding via same sentence-transformer model",
                "FAISS k-NN search (top-k=5) with inner product scoring",
                "Rolling context window assembles retrieved chunks + prior exchange history",
              ],
            },
            {
              title: "3. Generation",
              items: [
                "Llama 3.1 local inference (llama.cpp / GGUF)",
                "Constrained to CPU-only - no GPU or API key required",
                "Multi-turn conversation with coherent history",
              ],
            },
            {
              title: "4. Offline Operation",
              items: [
                "100% offline operation with local embeddings (Sentence-Transformers)",
                "FAISS vector store for fast similarity search",
                "Zero internet dependency, no API keys",
                "Simple Flask web interface for Q&A",
              ],
            },
          ],
          techStack: ["Flask", "FAISS", "Sentence-Transformers", "Llama 3.1", "Python"],
        }),
        repoUrl: "https://github.com/tajul06/Edu_Chat",
        tags: ["Python", "Flask", "FAISS", "Sentence-Transformers", "Llama", "Offline AI"],
        sortOrder: 2,
        visible: true,
      },
      {
        name: "Fabric Inspection Prototype",
        description: `Adaptive few-shot learning framework for automated fabric defect detection and inspection. Built as BSc thesis project (CSE499) exploring multiple deep learning approaches for textile quality assurance.`,
        architecture: JSON.stringify({
          stages: [
            {
              title: "1. Model Selection",
              items: [
                "ResNet50 + EfficientNet with PatchCore anomaly detection",
                "WinCLIP few-shot learning (5 examples)",
                "Prototypical Networks (5 reference images per defect type)",
              ],
            },
            {
              title: "2. Model Training",
              items: [
                "PatchCore models: 22 variations trained on AITEX, TILDA, ZJU-Leaper datasets",
                "Few-shot training: 5 images per defect type",
                "Prototypical Networks: 94.4% accuracy (woven), 78.2% (knitted)",
              ],
            },
            {
              title: "3. Anomaly Detection",
              items: [
                "96.8% AUROC on woven anomaly detection (22 PatchCore models, anomalib)",
                "98.98% F1 on fabric-type classification (ResNet-50)",
                "5-reference-image few-shot classifier enables new defect types",
              ],
            },
            {
              title: "4. Pipeline Implementation",
              items: [
                "5-stage pipeline: Type classification -> Pattern recognition -> Anomaly detection -> Defect typing -> Severity scoring",
                "Flask dashboard with live camera capture and Pass/Hold/Reject scoring",
                "Real-time processing for textile quality assurance",
              ],
            },
            {
              title: "5. Results & Metrics",
              items: [
                "96.8% AUROC on woven anomaly detection (9.9 points above fabric-level baseline)",
                "98.98% F1 on fabric-type classification (ResNet-50)",
                "Few-shot classifier trained on just 5 reference images per defect type",
              ],
            },
          ],
          techStack: ["Python", "PyTorch", "anomalib", "EasyFSL", "OpenCV", "CLAHE", "ResNet50", "EfficientNet", "scikit-learn", "Flask"],
        }),
        repoUrl: "https://github.com/tajul06/fabric-inspection-prototype",
        tags: ["Python", "PyTorch", "Computer Vision", "Few-Shot Learning", "PatchCore", "CLIP", "Flask"],
        sortOrder: 3,
        visible: true,
      },
      {
        name: "Drone Detection Pipeline (VisDrone)",
        description: `Multi-phase aerial computer vision pipeline for human and car detection/tracking in drone footage. Analyzed 6,471 frames from the VisDrone2019 dataset.`,
        architecture: JSON.stringify({
          stages: [
            {
              title: "1. Detection Models",
              items: [
                "YOLO26s-OBB: 0.838 mAP50 (best overall)",
                "YOLO11s: 0.793 mAP50",
                "RT-DETR: 0.738 mAP50",
              ],
            },
            {
              title: "2. Tracking Algorithms",
              items: [
                "BoT-SORT: 49.3% MOTA, 55.6% IDF1",
                "ByteTrack: 48.7% MOTA, 52.1% IDF1",
              ],
            },
            {
              title: "3. Evaluation Results",
              items: [
                "YOLO26s-OBB achieved highest mAP50 (0.838) and precision (0.806)",
                "Detected 52,518 humans and 25,842 cars across test set",
                "Average crowd density: 8.1 humans and 4.0 cars per frame",
                "Analyzed 6,471 frames from VisDrone2019 dataset",
              ],
            },
            {
              title: "4. Implementation",
              items: [
                "Multi-phase aerial computer vision pipeline",
                "Comprehensive evaluation of SOTA detection and tracking methods",
                "Built for aerial surveillance applications",
              ],
            },
          ],
          techStack: ["Python", "YOLO", "RT-DETR", "BoT-SORT", "ByteTrack", "OpenCV"],
        }),
        repoUrl: "https://github.com/tajul06/Visdrone-Human-and-Car-Detection-Pipeline",
        tags: ["Python", "YOLO", "Computer Vision", "Object Detection", "Tracking", "Drone", "VisDrone"],
        sortOrder: 4,
        visible: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create hobbies
  await prisma.hobby.deleteMany({});
  await prisma.hobby.createMany({
    data: [
      { name: "Coding Side Projects", icon: "💻", sortOrder: 0 },
      { name: "Reading Tech Blogs", icon: "📚", sortOrder: 1 },
      { name: "Watching Anime", icon: "🎬", sortOrder: 2 },
      { name: "Playing Chess", icon: "♟️", sortOrder: 3 },
    ],
    skipDuplicates: true,
  });

  // Create anime list
  await prisma.anime.deleteMany({});
  await prisma.anime.createMany({
    data: [
      { title: "Attack on Titan", status: "Completed", rating: 10, sortOrder: 0 },
      { title: "Demon Slayer", status: "Completed", rating: 9, sortOrder: 1 },
      { title: "Jujutsu Kaisen", status: "Watching", rating: null, sortOrder: 2 },
      { title: "One Punch Man", status: "Plan to Watch", rating: null, sortOrder: 3 },
    ],
    skipDuplicates: true,
  });

  // Create books
  await prisma.book.deleteMany({});
  await prisma.book.createMany({
    data: [
      { title: "Deep Learning", author: "Ian Goodfellow", status: "Read", rating: 9, sortOrder: 0 },
      { title: "Hands-On Machine Learning", author: "Aurelien Geron", status: "Read", rating: 10, sortOrder: 1 },
      { title: "Designing Machine Learning Systems", author: "Chip Huyen", status: "Reading", rating: null, sortOrder: 2 },
      { title: "Clean Code", author: "Robert C. Martin", status: "Want to Read", rating: null, sortOrder: 3 },
    ],
    skipDuplicates: true,
  });

  // Create skills
  await prisma.skill.deleteMany({});
  await prisma.skill.createMany({
    data: [
      { name: "Python", group: "Languages", sortOrder: 0 },
      { name: "SQL", group: "Languages", sortOrder: 1 },
      { name: "PyTorch", group: "Deep Learning", sortOrder: 2 },
      { name: "YOLO", group: "Computer Vision", sortOrder: 3 },
      { name: "LangChain", group: "LLM/NLP", sortOrder: 4 },
      { name: "RAG", group: "LLM/NLP", sortOrder: 5 },
      { name: "Flask", group: "Web Development", sortOrder: 6 },
      { name: "React", group: "Web Development", sortOrder: 7 },
      { name: "Next.js", group: "Web Development", sortOrder: 8 },
    ],
    skipDuplicates: true,
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });