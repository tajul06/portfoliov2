import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Rate limiting store (in-memory, simple)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Daily spend tracking
let dailySpend = 0;
let dailyResetAt = Date.now() + 24 * 60 * 60 * 1000;

const RATE_LIMIT = 10; // messages per minute per IP
const DAILY_LIMIT_USD = parseFloat(process.env.CHATBOT_DAILY_LIMIT_USD || "5.00");
const MAX_MESSAGE_LENGTH = 500;

function getRateLimitKey(req: NextRequest): string {
  return req.ip || req.headers.get("x-forwarded-for") || "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

function checkDailySpend(): boolean {
  const now = Date.now();
  if (now > dailyResetAt) {
    dailySpend = 0;
    dailyResetAt = now + 24 * 60 * 60 * 1000;
  }
  return dailySpend < DAILY_LIMIT_USD;
}

async function getPortfolioContext() {
  const [profile, projects, experience, education, skills] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    prisma.experience.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    prisma.education.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.skill.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return {
    profile,
    projects: projects.map((p) => ({
      name: p.name,
      description: p.description,
      tags: p.tags,
      link: p.link,
      repoUrl: p.repoUrl,
    })),
    experience: experience.map((e) => ({
      role: e.role,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: e.bullets,
    })),
    education: education.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      details: edu.details,
    })),
    skills: skills.map((s) => s.name),
  };
}

export async function POST(req: NextRequest) {
  try {
    // Check if chatbot is enabled
    if (process.env.NEXT_PUBLIC_CHATBOT_ENABLED !== "true") {
      return NextResponse.json({ error: "Chatbot is currently disabled" }, { status: 503 });
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(req);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    // Daily spend check
    if (!checkDailySpend()) {
      return NextResponse.json(
        { error: "Daily limit reached. Please try again tomorrow." },
        { status: 503 }
      );
    }

    const { message } = await req.json();

    // Input validation
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // Get portfolio context
    const context = await getPortfolioContext();

    // Initialize Gemini API
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try primary model first, fallback to secondary
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    } catch {
      model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
    }

    // Build system prompt with full portfolio context
    const systemPrompt = `You are Waddle, Md. Tajul Islam's AI Duck Assistant. Answer all questions strictly based on this embedded portfolio data. If asked about anything outside this scope, politely decline and provide the email.

**About Md. Tajul Islam:**
${context.profile?.bio || "Software developer specializing in ML/AI and web systems."}

**Contact:**
- Email: ${context.profile?.email}
- GitHub: ${context.profile?.githubUrl}
- LinkedIn: ${context.profile?.linkedinUrl}
- Location: ${context.profile?.location}

**Education:**
${context.education.length > 0 ? context.education.map((edu) => {
  const year = edu.endDate ? new Date(edu.endDate).getFullYear() : (edu.startDate ? new Date(edu.startDate).getFullYear() : "");
  const timeStr = year ? ` (${year})` : "";
  return `- **${edu.degree}** — ${edu.institution}${timeStr}${edu.details ? `\n  Details: ${edu.details}` : ""}`;
}).join("\n") : "No education listed"}

**Projects:**
${context.projects.map((p) => {
      const desc = p.description || "";
      return `**${p.name}**
${desc}
Tech: ${p.tags.join(", ")}
${p.repoUrl ? `Repo: ${p.repoUrl}` : ""}`;
    }).join("\n\n")}

**Experience:**
${context.experience.length > 0 ? context.experience.map((e) => `${e.role} at ${e.company} (${e.startDate ? e.startDate.toLocaleDateString() : "TBD"} - ${e.endDate ? e.endDate.toLocaleDateString() : "Present"}): ${e.bullets.join(" ")}`).join("\n") : "No experience listed"}

**Skills:** ${context.skills.join(", ")}

**Guidelines:**
- Answer concisely (2-3 sentences).
- Quote project details, tech stack, and metrics directly from above.
- For out-of-scope questions, say "I don't have that information. Reach out to ${context.profile?.email}."
- Be professional ,friendly and helpful.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'll answer questions based strictly on the portfolio information provided, and direct users to email for anything outside that scope." }],
        },
      ],
    });

    const result = await chat.sendMessageStream(message);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
        } catch (err) {
          console.error("Stream chunk error:", err);
        } finally {
          controller.close();
        }
      },
    });

    // Track approximate spend
    dailySpend += 0.0001;

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });

  } catch (error: any) {
    console.error("Chatbot error:", error);

    // Check if it's a Gemini API error
    if (error.message?.includes("API key") || error.message?.includes("quota")) {
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
