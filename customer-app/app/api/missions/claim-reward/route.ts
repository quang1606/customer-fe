import { NextResponse } from "next/server";
import { customerFetch } from "@/lib/customer-api";
import { mockResponse } from "@/lib/mock-data";

export async function POST(req: Request) {
  if (process.env.USE_MOCK === "true") {
    const body = await req.json();
    return NextResponse.json(mockResponse({
      mission: {
        missionId: body.missionId,
        requestId: "REQ-" + Date.now(),
        missionName: "Thanh toán 5 lần",
        missionDescription: "Thực hiện 5 giao dịch thanh toán thành công",
        targetValue: 5,
        rewardType: "VOUCHER",
        rewardValue: "Giảm 50K",
        voucherDetail: null,
        partnerId: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        status: "CLAIMED",
      },
      voucherDetail: {
        id: 100,
        voucherCode: "MISSION50K",
        requestId: "REQ-" + Date.now(),
        voucherName: "Giảm 50K đơn từ 200K",
        description: "Giảm 50.000đ cho đơn hàng từ 200.000đ",
        discountType: "FIXED",
        discountValue: 50000,
        maxDiscount: 50000,
        minOrderValue: 200000,
        totalStock: 100,
        availableStock: 50,
        maxCollect: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        status: "ACTIVE",
      },
    }));
  }
  try {
    const authHeader = req.headers.get("authorization");
    console.log("[Missions/ClaimReward] Authorization header:", authHeader);
    const body = await req.json();
    console.log("[Missions/ClaimReward] Body:", JSON.stringify(body));
    const { data, status, ok } = await customerFetch(
      `/api/customers/missions/claim-reward`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
      }
    );
    console.log("[Missions/ClaimReward] Upstream response status:", status, "data:", JSON.stringify(data));
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Missions/ClaimReward] Error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
