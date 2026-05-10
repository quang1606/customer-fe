import { NextResponse } from "next/server";
import { identityFetch } from "@/lib/identity-api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, status, ok } = await identityFetch("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
