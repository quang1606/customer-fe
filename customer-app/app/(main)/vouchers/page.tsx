"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { voucherService } from "@/lib/services/voucherService";
import { AvailableVoucher, MyVoucher, CustomerVoucherStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Ticket } from "lucide-react";

const statusColors: Record<CustomerVoucherStatus, string> = {
  AVAILABLE: "bg-green-500",
  USED: "bg-gray-500",
  EXPIRED: "bg-red-500",
};

const statusLabels: Record<CustomerVoucherStatus, string> = {
  AVAILABLE: "Khả dụng",
  USED: "Đã dùng",
  EXPIRED: "Hết hạn",
};

export default function VouchersPage() {
  const { customerId } = useAuthStore();
  const [available, setAvailable] = useState<AvailableVoucher[]>([]);
  const [myVouchers, setMyVouchers] = useState<MyVoucher[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [loadingMy, setLoadingMy] = useState(true);
  const [collecting, setCollecting] = useState<number | null>(null);

  const fetchAvailable = () => {
    if (!customerId) return;
    setLoadingAvailable(true);
    voucherService
      .getAvailable(customerId)
      .then((res) => {
        const d = res.data?.data;
        setAvailable(Array.isArray(d?.data) ? d.data : []);
      })
      .catch(() => {})
      .finally(() => setLoadingAvailable(false));
  };

  const fetchMyVouchers = () => {
    if (!customerId) return;
    setLoadingMy(true);
    const status = statusFilter === "ALL" ? undefined : statusFilter;
    voucherService
      .getMyVouchers(customerId, status)
      .then((res) => {
        const d = res.data?.data;
        setMyVouchers(Array.isArray(d?.data) ? d.data : []);
      })
      .catch(() => {})
      .finally(() => setLoadingMy(false));
  };

  useEffect(() => { fetchAvailable(); }, [customerId]);
  useEffect(() => { fetchMyVouchers(); }, [customerId, statusFilter]);

  const handleCollect = async (voucherId: number) => {
    if (!customerId) return;
    setCollecting(voucherId);
    try {
      await voucherService.collect(voucherId, customerId);
      toast({ title: "Thu thập voucher thành công!" });
      fetchAvailable();
      fetchMyVouchers();
    } catch {
      toast({ title: "Không thể thu thập voucher", variant: "destructive" });
    } finally {
      setCollecting(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Voucher</h1>

      <Tabs defaultValue="available">
        <TabsList className="w-full">
          <TabsTrigger value="available" className="flex-1">Khả dụng</TabsTrigger>
          <TabsTrigger value="mine" className="flex-1">Của tôi</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          {loadingAvailable ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}</div>
          ) : available.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Không có voucher khả dụng</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {available.map((v) => (
                <Card key={v.id} className="overflow-hidden">
                  <div className={`h-2 ${v.discountType === "PERCENT" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"}`} />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{v.voucherName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{v.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        {v.discountType === "PERCENT" ? `${v.discountValue}%` : formatCurrency(v.discountValue)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        HSD: {formatDate(v.endDate)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Đơn tối thiểu: {formatCurrency(v.minOrderValue)} | Còn: {v.availableStock}/{v.totalStock}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={v.collected || collecting === v.id}
                      onClick={() => handleCollect(v.id)}
                    >
                      {v.collected ? "Đã thu thập" : collecting === v.id ? "Đang xử lý..." : "Thu thập"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine">
          <div className="mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="AVAILABLE">Khả dụng</SelectItem>
                <SelectItem value="USED">Đã sử dụng</SelectItem>
                <SelectItem value="EXPIRED">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loadingMy ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>
          ) : myVouchers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có voucher nào</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {myVouchers.map((v) => (
                <Card key={v.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{v.voucherCode}</CardTitle>
                      <Badge className={`${statusColors[v.status]} text-white text-xs`}>
                        {statusLabels[v.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {v.nameStore && <p className="text-sm text-muted-foreground">{v.nameStore}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Còn {v.availableUsage} lượt sử dụng</p>
                    <p className="text-xs text-muted-foreground mt-1">HSD: {formatDate(v.expiredAt)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
