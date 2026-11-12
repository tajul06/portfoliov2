# Md Tajul Islam - Portfolio

<md.tajul2000@gmail.com> | +880 1535-209226 | Dhaka, Bangladesh>
[LinkedIn](https://linkedin.com/in/tajul06) |
[GitHub](https://github.com/tajul06) |
[Portfolio](https://tajul06.github.io/portfolio)

---

## Summary

Final-year CS student building applied computer vision and ML systems end-to-end — from dataset curation to Flask-deployed prototypes. Led a 3-person capstone team building a multi-stage fabric defect inspection pipeline (classification, few-shot defect detection, anomaly localisation). Seeking a computer vision / applied ML internship to apply this project experience in a production research setting.

---

## Education

**B.Sc. in Computer Science and Engineering**  
North South University, Dhaka, Bangladesh  
Relevant coursework: Algorithms, Deep Learning, Artificial Intelligence, Database Systems, Software Engineering

**Higher Secondary Certificate (Science)**  
Bangladesh Navy College, Dhaka, Bangladesh

---

## Technical Skills

### Programming Languages
- Python, SQL

### Computer Vision & Deep Learning
- PyTorch, YOLO, OpenCV, timm, anomalib, EasyFSL, CLAHE

### LLM / NLP & Retrieval
- RAG, LangChain (LCEL), FAISS, Pinecone, sentence-transformers, Hugging Face Transformers, PyMuPDF, Jina

### Web & Application Development
- Flask, FastAPI, React, Vite, SQLAlchemy, SQLite, Supabase

### Tools & Workflow
- Git, VS Code, Kaggle Notebooks, GPU Training (P100/T4)

---

## Projects

### Fabric Inspection Prototype (CSE499 — Senior Capstone)

*2025–2026 · Led 3-person team; owned model training & evaluation*  
**Technologies:** Python, PyTorch, Flask, anomalib, EasyFSL  
[GitHub Repository](https://github.com/tajul06/fabric-inspection-prototype)

- Built a 5-stage fabric inspection pipeline (type classification → pattern recognition → anomaly detection → defect typing → severity scoring), trained across 5 public datasets (AITEX, TILDA, ZJU-Leaper, TFD, ISL-Knit).
- Reached **96.8% AUROC** on woven anomaly detection (22 pattern-specific PatchCore models, anomalib) — 9.9 points above a fabric-level baseline — and **98.98% F1** on fabric-type classification (ResNet-50).
- Built a few-shot defect classifier (Prototypical Networks) hitting **94.4% accuracy** on woven / **78.2% on knitted** defects, letting new defect types be added with just 5 reference images; shipped as a Flask dashboard with live camera capture and Pass/Hold/Reject scoring.

---

### AI Sensei — Full-Stack AI Study Assistant

*2026 · Sole Developer*  
**Technologies:** React, FastAPI, LangChain, Pinecone, Gemini, Supabase  
**Live:** https://ai-sensei-lime.vercel.app  
[GitHub Repository](https://github.com/tajul06/AI-Sensei)

- Built a full-stack RAG study assistant: React + Vite frontend with Supabase email/Google OAuth, FastAPI backend, and Pinecone vector store; deployed live on Vercel.
- Orchestrated the RAG pipeline with LangChain LCEL — PDF chunking (RecursiveCharacterTextSplitter), Pinecone retrieval, Jina reranking, and Gemini generation — scoped per user and subject.
- Streamed AI responses token-by-token from FastAPI to the React chat UI; persisted session history in Supabase and rendered Markdown, GFM, and KaTeX math notation.

---

### TalkBuddy — Real-Time Local Voice Agent

*2026–Present · Sole Developer*  
**Technologies:** Python, FastAPI, WebSockets, llama.cpp, faster-whisper, Kokoro, Silero VAD  
[GitHub Repository](https://github.com/tajul06/talkbuddy)

- Built an open-source conversational voice agent with an asynchronous FastAPI pipeline spanning voice activity detection, speech-to-text, local LLM inference, and speech synthesis.
- Implemented bidirectional WebSocket audio streaming with barge-in support and sub-second responses for natural real-time conversation.
- Integrated model-agnostic GGUF loading through llama.cpp, faster-whisper large-v3-turbo for transcription, and CPU-friendly Kokoro-82M text-to-speech for private, cloud-free inference.

---

### VisDrone Human & Vehicle Detection Pipeline

*2026 · Computer Vision Project · Sole Developer*  
**Technologies:** Python, YOLO, Flask, OpenCV  
[GitHub Repository](https://github.com/tajul06/Visdrone-Human-and-Car-Detection-Pipeline)

- Fine-tuned and benchmarked 5 detection architectures (YOLO26-s/m, YOLO26-HBB, YOLO11s, RT-DETR) on the 548-image VisDrone validation set on Kaggle GPU instances (P100/T4); best model reached **83.8% mAP50**, **82.4% precision**, **76.7% recall**.
- Applied confidence-threshold tuning and BoT-SORT/ByteTrack multi-object tracking to improve small-object recall, on a dataset where over 54% of ground-truth boxes were under 32×32 pixels.
- Built a Flask web app serving the fine-tuned YOLO26-HBB checkpoint, adding multi-tracker support, bounding-box visualisation, and object counting for real-time inference on a 6,471-image benchmark set.

---

### EduChat — Offline PDF Question-Answering System (CSE299)

*2024 · LLM / RAG Project · Sole Developer*  
**Technologies:** Python, Flask, FAISS, sentence-transformers  
[GitHub Repository](https://github.com/tajul06/Edu_Chat)

- Built a fully offline RAG pipeline for querying course PDFs — sliding-window chunking with token overlap, sentence-transformer embeddings, and FAISS vector search — with zero internet dependency and no API key required.
- Implemented a rolling context window that assembles retrieved chunks with prior exchange history, maintaining coherent multi-turn conversation across sessions.
- Constrained the full stack to CPU-only inference, running on standard student hardware with no external dependencies beyond Python.

---

### Texas Hold'em Poker Simulator (CSE440 — AI Course)

*2025 · Game Logic Developer (4-person team)*  
**Technologies:** Python  
[GitHub Repository](https://github.com/tajul06/Poker-game-simulator-)

- Built the core game engine (deck, hand evaluation, side pots, multi-player state) as the evaluation environment for the team's expectiminimax AI agent.
- Agent used depth-limited expectiminimax with Monte Carlo hand-strength sampling (1,000 trials/decision) to model opponent uncertainty.

---

*Last updated: November 2026*
