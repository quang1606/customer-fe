import { NextResponse } from "next/server";
import { identityFetch } from "@/lib/identity-api";
import { MOCK_USER, mockResponse } from "@/lib/mock-data";

export async function GET(req: Request) {
  if (process.env.USE_MOCK === "true") {
    return NextResponse.json(mockResponse(MOCK_USER));
  }
  try {
    const authHeader = req.headers.get("authorization");
    console.log("[Profile/GET] Authorization header:", authHeader);
    const { data, status, ok } = await identityFetch("/api/v1/profile", {
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    console.log("[Profile/GET] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Profile/GET] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (process.env.USE_MOCK === "true") {
    const body = await req.json();
    return NextResponse.json(mockResponse({ ...MOCK_USER, ...body }));
  }
  try {
    const authHeader = req.headers.get("authorization");
    console.log("[Profile/PUT] Authorization header:", authHeader);
    const body = await req.json();
    console.log("[Profile/PUT] Body:", JSON.stringify(body));
    const { data, status, ok } = await identityFetch("/api/v1/profile", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    console.log("[Profile/PUT] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Profile/PUT] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
