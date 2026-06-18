import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";
import { mockResponse } from "@/lib/mock-data";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.USE_MOCK === "true") {
    const { id } = await params;
    return NextResponse.json(mockResponse({ message: `Voucher ${id} collected successfully` }));
  }
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    console.log("[Vouchers/Collect] Authorization header:", authHeader, "id:", id);
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    const { data, status, ok } = await customerFetch(
      `/api/customers/vouchers/collect/${id}?${query}`,
      {
        method: "POST",
        headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
      }
    );
    console.log("[Vouchers/Collect] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Vouchers/Collect] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
