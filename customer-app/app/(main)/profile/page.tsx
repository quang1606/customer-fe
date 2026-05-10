"use client";

import { useEffect, useState } from "react";
import { profileService } from "@/lib/services/profileService";
import { useAuthStore } from "@/lib/auth";
import { User } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { setUser } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    profileService
      .get()
      .then((res) => {
        const data = res.data.data;
        setProfile(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: (data as unknown as { phone?: string }).phone || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.update(form);
      setProfile(res.data.data);
      setUser(res.data.data);
      toast({ title: "Cập nhật thành công" });
    } catch {
      toast({ title: "Cập nhật thất bại", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast({ title: "Mật khẩu xác nhận không khớp", variant: "destructive" });
      return;
    }
    setChangingPw(true);
    try {
      await profileService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast({ title: "Đổi mật khẩu thành công" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast({ title: "Đổi mật khẩu thất bại", variant: "destructive" });
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Cập nhật thông tin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Đang lưu..." : "Cập nhật"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input id="currentPassword" type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input id="newPassword" type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input id="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required />
                </div>
                <Button type="submit" disabled={changingPw}>
                  {changingPw ? "Đang xử lý..." : "Đổi mật khẩu"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
