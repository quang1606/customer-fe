import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const { data, status, ok } = await customerFetch(`/api/customers/leaderboard`, {
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
