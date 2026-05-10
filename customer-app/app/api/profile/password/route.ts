import { NextResponse } from "next/server";
import { identityFetch } from "@/lib/identity-api";

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const body = await req.json();
    const { data, status, ok } = await identityFetch("/api/v1/profile/password", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
