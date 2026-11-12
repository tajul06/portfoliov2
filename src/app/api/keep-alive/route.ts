import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const startTime = Date.now();

  // Optional security check: if CRON_SECRET is configured, require Bearer token
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let dbStatus = "connected";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    // Lightweight database ping query to keep Supabase pooler active
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (err: any) {
    dbStatus = `error: ${err.message || "Failed to reach database"}`;
  }

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: "alive",
      message: "Server and database keep-alive heartbeat successful",
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      responseTimeMs,
      uptimeSeconds: Math.floor(process.uptime()),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "X-Keep-Alive": "healthy",
      },
    }
  );
}

export async function HEAD(req: NextRequest) {
  return GET(req);
}
