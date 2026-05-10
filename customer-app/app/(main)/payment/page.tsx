"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { voucherService } from "@/lib/services/voucherService";
import { paymentService } from "@/lib/services/paymentService";
import { ApplicableVoucher, PaymentResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, CreditCard } from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const { customerId } = useAuthStore();

  const invoiceId = searchParams.get("invoiceId") || "";
  const orderAmount = Number(searchParams.get("amount")) || 0;
  const storeName = searchParams.get("store") || "";

  const [vouchers, setVouchers] = useState<ApplicableVoucher[]>([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    if (customerId && storeName && orderAmount > 0) {
      setLoading(true);
      voucherService
        .getApplicable(customerId, storeName, orderAmount)
        .then((res) => {
          const d = res.data?.data;
          setVouchers(Array.isArray(d?.data) ? d.data : []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [customerId, storeName, orderAmount]);

  const selectedVoucher = vouchers.find((v) => String(v.voucherId) === selectedVoucherId);
  const discount = selectedVoucher
    ? selectedVoucher.discountType === "PERCENT"
      ? Math.min((orderAmount * parseFloat(selectedVoucher.discountValue)) / 100, parseFloat(selectedVoucher.maxDiscount) || Infinity)
      : parseFloat(selectedVoucher.discountValue)
    : 0;
  const finalAmount = Math.max(orderAmount - discount, 0);

  const handlePayment = async () => {
    if (!invoiceId) {
      toast({ title: "Vui lòng chọn hóa đơn", variant: "destructive" });
      return;
    }
    setProcessing(true);
    try {
      const res = await paymentService.process({
        invoiceId: Number(invoiceId),
        voucherId: selectedVoucherId ? Number(selectedVoucherId) : undefined,
        orderAmount,
      });
      setResult(res.data);
      toast({ title: "Thanh toán thành công!" });
    } catch {
      toast({ title: "Thanh toán thất bại", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Kết quả thanh toán</h1>
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold">Thanh toán thành công!</h2>
            <div className="space-y-2 text-sm">
              <p>Mã giao dịch: <span className="font-mono font-bold">{result.transactionId}</span></p>
              <p>Số tiền gốc: <span className="font-bold">{formatCurrency(result.originalAmount)}</span></p>
              <p>Giảm giá: <span className="font-bold text-green-600">{formatCurrency(result.discountAmount)}</span></p>
              <p>Thanh toán: <span className="font-bold">{formatCurrency(result.finalAmount)}</span></p>
              <p>Điểm nhận được: <span className="font-bold text-primary">{result.pointsEarned}</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Thanh toán</h1>
      {!invoiceId ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Vui lòng chọn hóa đơn từ trang Hóa đơn</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle>Thông tin đơn hàng</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cửa hàng:</span>
                <span className="font-medium">{storeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số tiền:</span>
                <span className="font-bold">{formatCurrency(orderAmount)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Chọn voucher</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-10 bg-muted animate-pulse rounded" />
              ) : vouchers.filter((v) => v.applicable).length === 0 ? (
                <p className="text-sm text-muted-foreground">Không có voucher áp dụng được</p>
              ) : (
                <Select value={selectedVoucherId} onValueChange={setSelectedVoucherId}>
                  <SelectTrigger><SelectValue placeholder="Chọn voucher (tùy chọn)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không sử dụng voucher</SelectItem>
                    {vouchers.filter((v) => v.applicable).map((v) => (
                      <SelectItem key={v.voucherId} value={String(v.voucherId)}>
                        {v.voucherName} - {v.discountType === "PERCENT" ? `${v.discountValue}%` : formatCurrency(v.discountValue)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-2">
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng thanh toán:</span>
                <span>{formatCurrency(finalAmount)}</span>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full" size="lg" disabled={processing} onClick={handlePayment}>
            {processing ? "Đang xử lý..." : `Thanh toán ${formatCurrency(finalAmount)}`}
          </Button>
        </>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-xl" />}>
      <PaymentContent />
    </Suspense>
  );
}
