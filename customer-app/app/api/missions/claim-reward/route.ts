import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const body = await req.json();
    const { data, status, ok } = await customerFetch(
      `/api/customers/missions/claim-reward`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
      }
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
