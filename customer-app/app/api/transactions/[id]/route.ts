import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";
import { mockResponse, MOCK_TRANSACTIONS } from "@/lib/mock-data";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (process.env.USE_MOCK === "true") {
    const tx = MOCK_TRANSACTIONS.data.find((t) => String(t.id) === id);
    if (!tx) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(mockResponse(tx));
  }
  try {
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    const { data, status, ok } = await customerFetch(
      `/api/customers/transactions/${id}?customerId=${customerId}`,
      {
        method: "GET",
        headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
      }
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Transaction Detail] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
