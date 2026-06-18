import { NextResponse } from "next/server";
import { identityFetch } from "@/lib/identity-api";
import { mockResponse } from "@/lib/mock-data";

export async function POST(req: Request) {
  if (process.env.USE_MOCK === "true") {
    const body = await req.json();
    console.log("[Auth/Login] Mock login for:", body.username);
    return NextResponse.json(mockResponse({
      accessToken: "mock-access-token-" + Date.now(),
      refreshToken: "mock-refresh-token-" + Date.now(),
      userId: "user-001",
      customerId: "99",
    }));
  }
  try {
    const body = await req.json();
    const { data, status, ok } = await identityFetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!ok) return NextResponse.json(data, { status });

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
