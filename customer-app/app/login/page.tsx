"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";
import { authService } from "@/lib/services/authService";
import { decodeJwtPayload } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setTokens, setCustomerId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
      const { accessToken, refreshToken } = res.data.data;
      setTokens(accessToken, refreshToken);

      // Decode JWT to get userId from payload
      const payload = decodeJwtPayload(accessToken);
      console.log("JWT payload:", payload);
      const uid = (payload?.userId || payload?.sub || payload?.user_id) as string | undefined;

      if (uid) {
        useAuthStore.getState().setUserId(uid);
        // Fetch customer profile using userId to get numeric customerId
        try {
          const profileRes = await fetch(`/api/customers/profile/${uid}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const profileData = await profileRes.json();
          if (profileData?.data?.id) {
            setCustomerId(String(profileData.data.id));
          }
        } catch {}
      }

      toast({ title: "Đăng nhập thành công" });
      router.push("/home");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast({
        title: "Đăng nhập thất bại",
        description: error.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Voucher Loyalty - Customer Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
          <p className="text-center text-sm mt-4 text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Đăng ký
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
