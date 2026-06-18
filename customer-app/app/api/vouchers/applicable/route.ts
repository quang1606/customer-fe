import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";
import { MOCK_APPLICABLE_VOUCHERS, mockResponse } from "@/lib/mock-data";

export async function GET(req: Request) {
  if (process.env.USE_MOCK === "true") {
    return NextResponse.json(mockResponse(MOCK_APPLICABLE_VOUCHERS));
  }
  try {
    const authHeader = req.headers.get("authorization");
    console.log("[Vouchers/Applicable] Authorization header:", authHeader);
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    const { data, status, ok } = await customerFetch(
      `/api/customers/vouchers/applicable?${query}`,
      { headers: { ...(authHeader ? { Authorization: authHeader } : {}) } }
    );
    console.log("[Vouchers/Applicable] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Vouchers/Applicable] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
