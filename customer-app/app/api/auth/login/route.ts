import { NextResponse } from "next/server";
import { identityFetch } from "@/lib/identity-api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, status, ok } = await identityFetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!ok) return NextResponse.json(data, { status });

    // Decode JWT payload to log in terminal
    const token = data?.data?.accessToken || data?.accessToken;
    if (token) {
      try {
        const parts = token.split(".");
        const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
        console.log("JWT payload:", JSON.stringify(payload, null, 2));
      } catch (e) {
        console.log("Failed to decode JWT:", e);
      }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
