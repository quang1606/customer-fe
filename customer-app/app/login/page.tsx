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
import { toast } from "@/hooks/use-toast";
import { Gift, Star, Trophy, ShieldCheck } from "lucide-react";

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
      const { accessToken, refreshToken, userId, customerId } = res.data.data;
      setTokens(accessToken, refreshToken);

      // Try to get userId from response first, then from JWT
      const uid = userId || (() => {
        const payload = decodeJwtPayload(accessToken);
        return (payload?.userId || payload?.sub || payload?.user_id) as string | undefined;
      })();

      if (uid) {
        useAuthStore.getState().setUserId(uid);
      }

      if (customerId) {
        setCustomerId(String(customerId));
      } else if (uid) {
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
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Gift className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-bold">Voucher Loyalty</h1>
            </div>
            <p className="text-xl text-white/80 leading-relaxed">
              Tích điểm, nhận thưởng và tận hưởng những ưu đãi độc quyền dành riêng cho bạn.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-white/90">Tích điểm mỗi giao dịch</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-white/90">Thăng hạng & nhận ưu đãi lớn</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-white/90">Bảo mật tuyệt đối</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Voucher Loyalty</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Chào mừng trở lại</h2>
              <p className="text-gray-500 mt-1">Đăng nhập để tiếp tục</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Nhập tên đăng nhập"
                  className="h-11 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  className="h-11 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
