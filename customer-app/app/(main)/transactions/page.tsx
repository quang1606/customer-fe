"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { transactionService } from "@/lib/services/transactionService";
import { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowDownLeft, ArrowUpRight, Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const { customerId } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!customerId) return;
    transactionService
      .getHistory(customerId)
      .then((res) => {
        const d = res.data?.data;
        setTransactions(Array.isArray(d?.data) ? d.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId]);

  const handleViewDetail = async (tx: Transaction) => {
    if (!customerId) return;
    setDetailLoading(true);
    setSelected(tx);
    try {
      const res = await transactionService.getDetail(tx.id, customerId);
      const detail = res.data?.data;
      if (detail) setSelected(detail);
    } catch {
      // fallback to list data
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lịch sử giao dịch</h1>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <ArrowDownLeft className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có giao dịch nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <Card
              key={tx.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleViewDetail(tx)}
            >
              <CardContent className="py-4 flex items-center gap-3">
                <div className="shrink-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.status === "SUCCESS" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {tx.status === "SUCCESS" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {tx.transactionId}
                    </span>
                    <Badge variant={tx.status === "SUCCESS" ? "default" : "destructive"} className="text-xs">
                      {tx.status === "SUCCESS" ? "Thành công" : "Thất bại"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{new Date(tx.createdAt).toLocaleDateString("vi-VN")}</span>
                    {tx.voucherCode && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Ticket className="h-3 w-3" />
                          {tx.voucherCode}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">{formatCurrency(tx.finalAmount)}</p>
                  {tx.discountAmount > 0 && (
                    <p className="text-xs text-green-600">-{formatCurrency(tx.discountAmount)}</p>
                  )}
                  {tx.pointsEarned > 0 && (
                    <p className="text-xs text-primary">+{tx.pointsEarned} điểm</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              {detailLoading ? (
                <div className="h-32 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã giao dịch</span>
                    <span className="font-mono text-sm font-medium">{selected.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <Badge variant={selected.status === "SUCCESS" ? "default" : "destructive"}>
                      {selected.status === "SUCCESS" ? "Thành công" : "Thất bại"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số tiền gốc</span>
                    <span className="font-medium">{formatCurrency(selected.originalAmount)}</span>
                  </div>
                  {selected.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giảm giá</span>
                      <span className="font-medium text-green-600">-{formatCurrency(selected.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thanh toán</span>
                    <span className="font-bold">{formatCurrency(selected.finalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Điểm nhận</span>
                    <span className="font-medium text-primary">+{selected.pointsEarned}</span>
                  </div>
                  {selected.voucherCode && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Voucher</span>
                      <span className="font-medium">{selected.voucherCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thời gian</span>
                    <span className="text-sm">{new Date(selected.createdAt).toLocaleString("vi-VN")}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
