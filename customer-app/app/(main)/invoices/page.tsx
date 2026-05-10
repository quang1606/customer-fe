"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { invoiceService } from "@/lib/services/invoiceService";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, Search } from "lucide-react";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ nameStore: "", title: "" });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchInvoices = (p = 0) => {
    setLoading(true);
    invoiceService
      .getAll({ page: p, size: 20, nameStore: filters.nameStore || undefined, title: filters.title || undefined })
      .then((res) => {
        const d = res.data?.data;
        setInvoices(Array.isArray(d?.data) ? d.data : []);
        setTotalPages(d?.totalPages || 1);
        setPage(p);
        setSearched(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleSearch = () => fetchInvoices(0);

  const handleSelect = (invoice: Invoice) => {
    router.push(`/payment?invoiceId=${invoice.id}&amount=${invoice.amount}&store=${encodeURIComponent(invoice.nameStore)}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Hóa đơn</h1>

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Tên cửa hàng"
              value={filters.nameStore}
              onChange={(e) => setFilters({ ...filters, nameStore: e.target.value })}
            />
            <Input
              placeholder="Tiêu đề"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            />
            <Button onClick={handleSearch} disabled={loading} className="shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}</div>
      ) : !searched ? (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Nhấn tìm kiếm để xem hóa đơn</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Không tìm thấy hóa đơn</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Tiêu đề</th>
                  <th className="text-left p-3">Cửa hàng</th>
                  <th className="text-right p-3">Số tiền</th>
                  <th className="text-left p-3">Ngày tạo</th>
                  <th className="text-right p-3"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{inv.title}</td>
                    <td className="p-3">{inv.nameStore}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(inv.amount)}</td>
                    <td className="p-3">{formatDateTime(inv.createdAt)}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleSelect(inv)}>
                        Thanh toán
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {invoices.map((inv) => (
              <Card key={inv.id} className="cursor-pointer hover:shadow-md" onClick={() => handleSelect(inv)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{inv.title}</p>
                      <p className="text-sm text-muted-foreground">{inv.nameStore}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDateTime(inv.createdAt)}</p>
                    </div>
                    <p className="font-bold text-primary">{formatCurrency(inv.amount)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button size="sm" variant="outline" disabled={page === 0} onClick={() => fetchInvoices(page - 1)}>
                Trước
              </Button>
              <span className="flex items-center text-sm">
                Trang {page + 1} / {totalPages}
              </span>
              <Button size="sm" variant="outline" disabled={page >= totalPages - 1} onClick={() => fetchInvoices(page + 1)}>
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
