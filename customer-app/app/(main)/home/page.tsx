"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";
import { customerService } from "@/lib/services/customerService";
import { CustomerProfile } from "@/lib/types";
import { formatCurrency, TIER_COLORS } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Target, CreditCard, Trophy } from "lucide-react";

export default function HomePage() {
  const { customerId, userId, user } = useAuthStore();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      customerService
        .getProfile(userId)
        .then((res) => setProfile(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>;
  }

  const quickActions = [
    { href: "/vouchers", label: "Voucher", icon: Ticket, color: "bg-blue-500" },
    { href: "/missions", label: "Nhiệm vụ", icon: Target, color: "bg-green-500" },
    { href: "/payment", label: "Thanh toán", icon: CreditCard, color: "bg-purple-500" },
    { href: "/leaderboard", label: "Xếp hạng", icon: Trophy, color: "bg-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Xin chào, {profile?.fullName || user?.firstName || "Khách"}</span>
            {profile?.tier && (
              <Badge style={{ backgroundColor: TIER_COLORS[profile.tier], color: "#000" }}>
                {profile.tier}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Số dư</p>
              <p className="text-lg font-bold">{formatCurrency(profile?.balance || 0)}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Điểm tích lũy</p>
              <p className="text-lg font-bold">{profile?.totalPoints || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3">Truy cập nhanh</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                  <div className={`p-2 rounded-full ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
