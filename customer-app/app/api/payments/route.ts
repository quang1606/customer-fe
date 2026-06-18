import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";
import { mockResponse } from "@/lib/mock-data";

export async function POST(req: Request) {
  if (process.env.USE_MOCK === "true") {
    const body = await req.json();
    return NextResponse.json(mockResponse({
      transactionId: "TXN-" + Date.now(),
      originalAmount: body.orderAmount,
      discountAmount: body.voucherId ? 50000 : 0,
      finalAmount: body.orderAmount - (body.voucherId ? 50000 : 0),
      pointsEarned: Math.floor(body.orderAmount / 10000),
      status: "SUCCESS",
    }));
  }
  try {
    const authHeader = req.headers.get("authorization");
    console.log("[Payments] Authorization header:", authHeader);
    const body = await req.json();
    console.log("[Payments] Body:", JSON.stringify(body));
    const { data, status, ok } = await customerFetch(`/api/v1/payments/process`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    console.log("[Payments] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Payments] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
