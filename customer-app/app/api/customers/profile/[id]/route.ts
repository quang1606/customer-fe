import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";
import { MOCK_CUSTOMER_PROFILE, mockResponse } from "@/lib/mock-data";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.USE_MOCK === "true") {
    return NextResponse.json(mockResponse(MOCK_CUSTOMER_PROFILE));
  }
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    console.log("[Customers/Profile] Authorization header:", authHeader, "id:", id);
    const { data, status, ok } = await customerFetch(`/api/customers/profile/${id}`, {
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    console.log("[Customers/Profile] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Customers/Profile] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
