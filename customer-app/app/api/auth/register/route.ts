import { NextResponse } from "next/server";
import { identityFetch } from "@/lib/identity-api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, status, ok } = await identityFetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Register proxy error:", error);
    return NextResponse.json(
      { status: 1, code: "error", message: "Không thể kết nối đến server", data: null },
      { status: 502 }
    );
  }
}
