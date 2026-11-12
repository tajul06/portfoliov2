# Database Implementations Across Projects

A technical breakdown of how relational databases, vector stores, memory layers, and feature banks are designed and implemented across Md. Tajul Islam's projects.

---

## Architecture Summary

| Project | Storage Type | Technology | Purpose |
| :--- | :--- | :--- | :--- |
| **Portfolio & Admin CMS** | Relational / ORM | PostgreSQL + Prisma ORM + Supabase | Full content management, dynamic resume JSON, auth, admin controls |
| **TalkBuddy** | Relational & 3-Tier Memory | PostgreSQL (Supabase) + In-Memory Fallback | Persistent user facts, session summaries, conversation history |
| **AI Sensei** | Managed Vector Database | Pinecone + LangChain | Dense document chunk embeddings, metadata filtering, RAG retrieval |
| **EduChat** | Local Embedded Vector Store | FAISS + Sentence-Transformers | 100% offline semantic search over educational textbooks and notes |
| **Fabric Inspection Prototype** | Feature Bank / Memory Bank | PyTorch Memory Bank + Coreset Subsampling | PatchCore anomaly embeddings and prototypical class representations |
| **VisDrone Pipeline** | In-Memory State & Tracklet DB | BoT-SORT / ByteTrack Tracking States | Frame-by-frame Kalman filter state, tracklet IDs, feature associations |

---

## 1. Portfolio & Admin CMS (`portfolio`)

### Core Database: PostgreSQL via Supabase & Prisma ORM
- **Driver / ORM**: Prisma ORM with connection pooling via Supabase (`DATABASE_URL` pooler on port 5432/6543, `DIRECT_URL` for migrations).
- **Authentication Store**: Supabase Auth (`@supabase/ssr`) storing sessions and user identities with cookie-based verification and email allowlists (`hauntedboydip@gmail.com`).

### Schema Models (11 Tables):
1. **`Profile`**:
   - Stores personal bio, headline, location, contact, photo URL.
   - Social links: GitHub, LinkedIn, Discord, Facebook, and Resume PDF URL.
2. **`Project`**:
   - Project showcase records with rich text descriptions, architecture notes, tech stack tags (`String[]`), demo links, and repo URLs.
3. **`Experience` & `Education`**:
   - Structured work history and academic background with bullet points stored as string arrays.
4. **`SavedCV`**:
   - Dynamic JSON field (`cvJson Json`) storing tailored resumes generated from job description keyword extraction, scoring projects and skills by relevance.
5. **`PhotoAlbum`, `Article`, `Book`, `Anime`, `Hobby`, `Skill`**:
   - Content tables powering the public `/beyond` page and `/haunted` CMS management screens.

---

## 2. TalkBuddy (`talkbuddy`)

### Storage Type: 3-Layer Memory Architecture (PostgreSQL on Supabase + In-Memory)
TalkBuddy separates memory into three distinct tiers to balance low latency (<3s TTFA) with long-term retention:

```
[Audio In] → [VAD] → [Whisper GPU] → [Llama 3.2 3B] → [Kokoro TTS]
                                             ↓
                                    [Memory Service]
                             ┌───────────────┼───────────────┐
                     [Short-Term RAM] [Session Summaries] [Long-Term Facts]
                             │               │               │
                     (Last 10-20 turns) (Supabase PG)   (Supabase PG)
```

### Implementation Details:
- **Client**: `supabase-py` (`create_client`) wrapped in a modular `SupabaseService`.
- **Tables**:
  - `users`: Tracks user identifiers (`user_id`).
  - `sessions`: Session tracking with activity timestamps (`session_id`, `status`, `last_activity`).
  - `user_facts`: Persistent user facts, preferences, goals, and personal details extracted via LLM. Includes contradiction checking before insertion.
  - `session_summaries`: Asynchronous session summaries capturing mood, topics discussed, and key takeaways.
- **Graceful Degradation**: If `SUPABASE__URL` or `SUPABASE__KEY` is omitted, the service automatically degrades to in-memory mode without crashing.
- **Asynchronous Worker**: Fact extraction and summary generation run in a background worker (`memory_worker.py`) after a session ends so the real-time voice pipeline is never blocked.

---

## 3. AI Sensei (`AI-Sensei`)

### Storage Type: Managed Cloud Vector Database (Pinecone)
- **Vector DB**: Pinecone serverless / pod index using cosine similarity metric.
- **Embedding Dimensions**: Dense vector embeddings generated via Google Gemini / text-embedding models.
- **Chunking Pipeline**: LangChain recursive character text splitter chunking uploaded PDFs with overlap to preserve semantic context.
- **Metadata Storage**: Each Pinecone vector payload includes:
  - `document_id`: Parent document tracking.
  - `page_number`: Exact source attribution for citations.
  - `text_chunk`: Raw snippet for context synthesis.
- **Two-Stage Retrieval**:
  1. Dense vector similarity search via Pinecone to fetch top candidate chunks ($k=10$).
  2. Jina AI cross-encoder reranker to re-order the top chunks before feeding them into Gemini Flash 1.5.

---

## 4. EduChat (`Edu_Chat`)

### Storage Type: Local Embedded Vector Store (FAISS)
- **Vector Index**: Facebook AI Similarity Search (`faiss-cpu`) operating entirely locally without internet.
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2` generating 384-dimensional dense vectors on local CPU.
- **Persistence**:
  - `index.faiss`: Serialized binary index containing vector representations of educational textbooks.
  - `metadata.pkl`: Pickled dictionary mapping internal vector indices to paragraph texts, chapter titles, and subject labels.
- **Query Pattern**: Incoming student questions are embedded locally, queried against the FAISS index with nearest-neighbor search ($L_2$ / Cosine), and injected into the local Llama prompt context.

---

## 5. Fabric Inspection Prototype (`fabric-inspection-prototype`)

### Storage Type: Non-Parametric Feature Bank & Class Prototype Store
Rather than a traditional SQL database, this project uses an in-memory feature embedding store for industrial defect detection:

- **PatchCore Memory Bank**:
  - Feature vectors extracted from intermediate convolutional layers of ResNet50 / EfficientNet on defect-free fabrics.
  - **Coreset Subsampling**: k-Center greedy subsampling algorithm reduces the memory footprint while maintaining boundary coverage for anomaly detection.
  - Anomaly scoring compares query patch features against nearest neighbors in the memory bank (96.8% AUROC).
- **Prototypical Networks Store**:
  - Computes class prototype centroids (mean embedding vectors) for each fabric defect category from 3–5 support examples, enabling few-shot classification (94.4% accuracy).

---

## 6. Drone Detection Pipeline (`VisDrone-Pipeline`)

### Storage Type: Frame-to-Frame Tracklet State Database
- **Tracking Database**: BoT-SORT / ByteTrack tracking engine state stores.
- **Tracklet State Store**:
  - Maintains Kalman filter state vectors (position $[x, y, a, h]$, velocities $[\dot{x}, \dot{y}, \dot{a}, \dot{h}]$).
  - Track lifecycle management: Active, lost, and removed states with ID persistence across occlusions.
  - Visual appearance embedding cache (Re-ID features) for BoT-SORT feature association.
- **Ground-Truth Store**: Structured parsing and indexing of VisDrone annotation files (bounding boxes, class IDs, truncation, occlusion flags) across 6,471 video frames.
