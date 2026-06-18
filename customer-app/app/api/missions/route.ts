import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";
import { MOCK_MISSIONS, mockResponse } from "@/lib/mock-data";

export async function GET(req: Request) {
  if (process.env.USE_MOCK === "true") {
    return NextResponse.json(mockResponse(MOCK_MISSIONS));
  }
  try {
    const authHeader = req.headers.get("authorization");
    console.log("[Missions] Authorization header:", authHeader);
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    const { data, status, ok } = await customerFetch(
      `/api/customers/missions?${query}`,
      { headers: { ...(authHeader ? { Authorization: authHeader } : {}) } }
    );
    console.log("[Missions] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Missions] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
