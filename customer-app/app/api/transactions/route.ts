import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";
import { mockResponse, MOCK_TRANSACTIONS } from "@/lib/mock-data";

export async function GET(req: Request) {
  if (process.env.USE_MOCK === "true") {
    return NextResponse.json(mockResponse(MOCK_TRANSACTIONS));
  }
  try {
    const authHeader = req.headers.get("authorization");
    console.log("[Transactions] Authorization header:", authHeader);
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();

    const { data, status, ok } = await customerFetch(
      `/api/customers/transactions?${query}`,
      {
        method: "GET",
        headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
      }
    );
    console.log("[Transactions] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Transactions] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
