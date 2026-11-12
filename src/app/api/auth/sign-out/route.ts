import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await signOut();
  } catch {
    // ignore
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export async function POST(request: NextRequest) {
  try {
    await signOut();
  } catch {
    // ignore
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
