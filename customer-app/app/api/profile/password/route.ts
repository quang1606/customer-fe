import { NextResponse } from "next/server";
import { identityFetch } from "@/lib/identity-api";
import { mockResponse } from "@/lib/mock-data";

export async function PUT(req: Request) {
  if (process.env.USE_MOCK === "true") {
    return NextResponse.json(mockResponse({ message: "Password changed successfully" }));
  }
  try {
    const authHeader = req.headers.get("authorization");
    console.log("[Profile/Password] Authorization header:", authHeader);
    const body = await req.json();
    console.log("[Profile/Password] Body:", JSON.stringify(body));
    const { data, status, ok } = await identityFetch("/api/v1/profile/password", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    console.log("[Profile/Password] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Profile/Password] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
