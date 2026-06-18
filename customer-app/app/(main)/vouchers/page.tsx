"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { voucherService } from "@/lib/services/voucherService";
import { AvailableVoucher, MyVoucher, CustomerVoucherStatus } from "@/lib/types";
import { formatCurrency, formatDate, formatDiscount } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Ticket, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

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
  const [selectedVoucher, setSelectedVoucher] = useState<AvailableVoucher | null>(null);
  const [selectedMyVoucher, setSelectedMyVoucher] = useState<MyVoucher | null>(null);

  // Pagination state for available vouchers
  const [availablePage, setAvailablePage] = useState(0);
  const [availableTotalPages, setAvailableTotalPages] = useState(0);

  // Pagination state for my vouchers
  const [myPage, setMyPage] = useState(0);
  const [myTotalPages, setMyTotalPages] = useState(0);

  const fetchAvailable = (page = availablePage) => {
    setLoadingAvailable(true);
    voucherService
      .getAvailable(customerId || "mock", page, PAGE_SIZE)
      .then((res) => {
        const d = res.data?.data;
        setAvailable(Array.isArray(d?.data) ? d.data : []);
        setAvailableTotalPages(d?.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoadingAvailable(false));
  };

  const fetchMyVouchers = (page = myPage) => {
    setLoadingMy(true);
    const status = statusFilter === "ALL" ? undefined : statusFilter;
    voucherService
      .getMyVouchers(customerId || "mock", status, page, PAGE_SIZE)
      .then((res) => {
        const d = res.data?.data;
        setMyVouchers(Array.isArray(d?.data) ? d.data : []);
        setMyTotalPages(d?.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoadingMy(false));
  };

  useEffect(() => { fetchAvailable(0); setAvailablePage(0); }, [customerId]);
  useEffect(() => { fetchMyVouchers(0); setMyPage(0); }, [customerId, statusFilter]);

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
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {available.map((v) => (
                  <Card
                    key={v.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedVoucher(v)}
                  >
                    <div className={`h-2 ${v.discountType === "PERCENT" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"}`} />
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{v.voucherName}</CardTitle>
                        <Badge className={`${v.status === "EXPIRED" ? "bg-red-500" : "bg-green-500"} text-white text-xs`}>
                          {v.status === "EXPIRED" ? "Hết hạn" : "Hoạt động"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <span className="font-bold text-primary text-lg">
                        {v.discountType === "PERCENT" ? `${formatDiscount(v.discountValue)}%` : formatCurrency(v.discountValue)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        HSD: {formatDate(v.startDate)} - {formatDate(v.endDate)}
                      </p>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        disabled={v.collected || collecting === v.id}
                        onClick={(e) => { e.stopPropagation(); handleCollect(v.id); }}
                      >
                        {v.collected ? "Đã thu thập" : collecting === v.id ? "Đang xử lý..." : "Thu thập"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {availableTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={availablePage === 0}
                    onClick={() => { const p = availablePage - 1; setAvailablePage(p); fetchAvailable(p); }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Trang {availablePage + 1} / {availableTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={availablePage >= availableTotalPages - 1}
                    onClick={() => { const p = availablePage + 1; setAvailablePage(p); fetchAvailable(p); }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
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
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {myVouchers.map((v) => (
                  <Card
                    key={v.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedMyVoucher(v)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{v.voucherName || v.voucherCode}</CardTitle>
                        <Badge className={`${statusColors[v.voucherStatus]} text-white text-xs`}>
                          {statusLabels[v.voucherStatus]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <span className="font-bold text-primary">
                        {v.discountType === "PERCENT" ? `${formatDiscount(v.discountValue)}%` : formatCurrency(v.discountValue)}
                      </span>
                      <p className="text-xs text-muted-foreground">Mã: {v.voucherCode}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.voucherStatus === "USED" ? "Đã sử dụng hết" : `Còn ${v.availableUsage} lượt sử dụng`}
                      </p>
                      <p className="text-xs text-muted-foreground">HSD: {formatDate(v.startDate)} - {formatDate(v.endDate)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {myTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={myPage === 0}
                    onClick={() => { const p = myPage - 1; setMyPage(p); fetchMyVouchers(p); }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Trang {myPage + 1} / {myTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={myPage >= myTotalPages - 1}
                    onClick={() => { const p = myPage + 1; setMyPage(p); fetchMyVouchers(p); }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog chi tiết voucher khả dụng */}
      <Dialog open={!!selectedVoucher} onOpenChange={(open) => { if (!open) setSelectedVoucher(null); }}>
        <DialogContent className="max-w-md">
          {selectedVoucher && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVoucher.voucherName}</DialogTitle>
                <DialogDescription>{selectedVoucher.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã voucher</span>
                  <span className="font-medium">{selectedVoucher.voucherCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại giảm giá</span>
                  <span className="font-medium">{selectedVoucher.discountType === "PERCENT" ? "Phần trăm" : "Cố định"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá trị giảm</span>
                  <span className="font-medium text-primary">
                    {selectedVoucher.discountType === "PERCENT" ? `${formatDiscount(selectedVoucher.discountValue)}%` : formatCurrency(selectedVoucher.discountValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm tối đa</span>
                  <span className="font-medium">{formatCurrency(selectedVoucher.maxDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đơn tối thiểu</span>
                  <span className="font-medium">{formatCurrency(selectedVoucher.minOrderValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hạng yêu cầu</span>
                  <span className="font-medium">{selectedVoucher.customerTier === "ALL" ? "Tất cả" : selectedVoucher.customerTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kho</span>
                  <span className="font-medium">{selectedVoucher.availableStock}/{selectedVoucher.totalStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian</span>
                  <span className="font-medium">{formatDate(selectedVoucher.startDate)} - {formatDate(selectedVoucher.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <Badge className={`${selectedVoucher.status === "EXPIRED" ? "bg-red-500" : "bg-green-500"} text-white text-xs`}>
                    {selectedVoucher.status === "EXPIRED" ? "Hết hạn" : "Hoạt động"}
                  </Badge>
                </div>
                <Button
                  className="w-full mt-2"
                  disabled={selectedVoucher.collected || collecting === selectedVoucher.id}
                  onClick={() => handleCollect(selectedVoucher.id)}
                >
                  {selectedVoucher.collected ? "Đã thu thập" : collecting === selectedVoucher.id ? "Đang xử lý..." : "Thu thập"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chi tiết voucher của tôi */}
      <Dialog open={!!selectedMyVoucher} onOpenChange={(open) => { if (!open) setSelectedMyVoucher(null); }}>
        <DialogContent className="max-w-md">
          {selectedMyVoucher && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMyVoucher.voucherName}</DialogTitle>
                <DialogDescription>{selectedMyVoucher.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã voucher</span>
                  <span className="font-medium">{selectedMyVoucher.voucherCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại giảm giá</span>
                  <span className="font-medium">{selectedMyVoucher.discountType === "PERCENT" ? "Phần trăm" : "Cố định"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá trị giảm</span>
                  <span className="font-medium text-primary">
                    {selectedMyVoucher.discountType === "PERCENT" ? `${formatDiscount(selectedMyVoucher.discountValue)}%` : formatCurrency(selectedMyVoucher.discountValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm tối đa</span>
                  <span className="font-medium">{formatCurrency(selectedMyVoucher.maxDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đơn tối thiểu</span>
                  <span className="font-medium">{formatCurrency(selectedMyVoucher.minOrderValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hạng yêu cầu</span>
                  <span className="font-medium">{selectedMyVoucher.customerTier === "ALL" ? "Tất cả" : selectedMyVoucher.customerTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kho</span>
                  <span className="font-medium">{selectedMyVoucher.availableStock}/{selectedMyVoucher.totalStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lượt sử dụng còn</span>
                  <span className="font-medium">
                    {selectedMyVoucher.voucherStatus === "USED" ? "0 (Đã sử dụng)" : selectedMyVoucher.availableUsage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày nhận</span>
                  <span className="font-medium">{formatDate(selectedMyVoucher.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hạn sử dụng</span>
                  <span className="font-medium">{formatDate(selectedMyVoucher.startDate)} - {formatDate(selectedMyVoucher.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <Badge className={`${statusColors[selectedMyVoucher.voucherStatus]} text-white text-xs`}>
                    {statusLabels[selectedMyVoucher.voucherStatus]}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
