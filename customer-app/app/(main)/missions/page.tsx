"use client";

import { useEffect, useState } from "react";
import { missionService } from "@/lib/services/missionService";
import { Mission, MissionClaimResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Target } from "lucide-react";

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [claimResult, setClaimResult] = useState<MissionClaimResult | null>(null);

  const fetchMissions = () => {
    setLoading(true);
    missionService
      .getAll(0, 20)
      .then((res) => {
        const data = res.data?.data;
        setMissions(Array.isArray(data?.missions) ? data.missions : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMissions(); }, []);

  const handleClaim = async (missionId: number) => {
    setClaiming(missionId);
    try {
      const res = await missionService.claimReward(missionId);
      const result = res.data?.data;
      setClaimResult(result);
      toast({ title: "Nhận thưởng thành công!" });
      fetchMissions();
    } catch {
      toast({ title: "Không thể nhận thưởng", variant: "destructive" });
    } finally {
      setClaiming(null);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "Đang thực hiện";
      case "COMPLETED": return "Hoàn thành";
      case "CLAIMED": return "Đã nhận thưởng";
      default: return status;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "bg-blue-500";
      case "COMPLETED": return "bg-green-500";
      case "CLAIMED": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nhiệm vụ</h1>

      {missions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Không có nhiệm vụ nào</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {missions.map((m) => {
            const progress = m.targetValue > 0 ? Math.min((m.currentProgress / m.targetValue) * 100, 100) : 0;
            return (
              <Card key={m.missionId}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{m.missionName}</CardTitle>
                    <Badge className={`${statusColor(m.status)} text-white text-xs`}>
                      {statusLabel(m.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{m.missionDescription}</p>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>
                        {m.targetType === "AMOUNT"
                          ? `${m.currentProgress.toLocaleString()}đ / ${m.targetValue.toLocaleString()}đ`
                          : `${m.currentProgress} / ${m.targetValue}`}
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Thưởng: {m.rewardType === "POINT"
                        ? `${m.rewardValue} điểm`
                        : m.voucherRequest?.voucherName || "Voucher"}
                    </span>
                  </div>
                  {m.status === "COMPLETED" && (
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={claiming === m.missionId}
                      onClick={() => handleClaim(m.missionId)}
                    >
                      {claiming === m.missionId ? "Đang xử lý..." : "Nhận thưởng"}
                    </Button>
                  )}
                  {m.status === "CLAIMED" && (
                    <Button size="sm" className="w-full" disabled>
                      Đã nhận thưởng
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!claimResult} onOpenChange={() => setClaimResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhận thưởng thành công</DialogTitle>
            <DialogDescription>
              Nhiệm vụ: {claimResult?.mission?.missionName}
            </DialogDescription>
          </DialogHeader>
          {claimResult?.voucherDetail && (
            <div className="space-y-2 text-sm">
              <div className="font-medium">{claimResult.voucherDetail.voucherName}</div>
              <p className="text-muted-foreground">{claimResult.voucherDetail.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>Mã voucher:</span>
                <span className="font-mono">{claimResult.voucherDetail.voucherCode}</span>
                <span>Giảm giá:</span>
                <span>
                  {claimResult.voucherDetail.discountType === "PERCENT"
                    ? `${claimResult.voucherDetail.discountValue}%`
                    : `${claimResult.voucherDetail.discountValue.toLocaleString()}đ`}
                </span>
                <span>Giảm tối đa:</span>
                <span>{claimResult.voucherDetail.maxDiscount.toLocaleString()}đ</span>
                <span>Voucher bắt đầu:</span>
                <span>{new Date(claimResult.voucherDetail.startDate).toLocaleDateString("vi-VN")}</span>
                <span>Voucher kết thúc:</span>
                <span>{new Date(claimResult.voucherDetail.endDate).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          )}
          {!claimResult?.voucherDetail && claimResult?.mission && (
            <div className="text-sm text-muted-foreground">
              Thưởng: {claimResult.mission.rewardType === "POINT"
                ? `${claimResult.mission.rewardValue} điểm`
                : "Voucher"}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
