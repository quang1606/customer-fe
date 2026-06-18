import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";
import { MOCK_LEADERBOARD, mockResponse } from "@/lib/mock-data";

export async function GET(req: Request) {
  if (process.env.USE_MOCK === "true") {
    return NextResponse.json(mockResponse(MOCK_LEADERBOARD));
  }
  try {
    const authHeader = req.headers.get("authorization");
    console.log("[Leaderboard] Authorization header:", authHeader);
    const { data, status, ok } = await customerFetch(`/api/customers/leaderboard`, {
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    console.log("[Leaderboard] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Leaderboard] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
