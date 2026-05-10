import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    const { data, status, ok } = await customerFetch(
      `/api/customers/vouchers/list?${query}`,
      { headers: { ...(authHeader ? { Authorization: authHeader } : {}) } }
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
