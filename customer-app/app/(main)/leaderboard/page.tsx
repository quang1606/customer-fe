"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { leaderboardService } from "@/lib/services/leaderboardService";
import { LeaderboardEntry, LeaderboardResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const { customerId } = useAuthStore();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardService
      .get()
      .then((res) => {
        const d = res.data?.data;
        if (d && d.topCustomers) {
          setData(d);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}</div>;
  }

  const entries = data?.topCustomers || [];
  const currentCustomer = data?.currentCustomer;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Bảng xếp hạng</h1>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Chưa có dữ liệu xếp hạng</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {entries.map((entry) => (
                  <RankRow key={entry.rank} entry={entry} isMe={String(entry.customerId) === customerId} />
                ))}
              </div>
            </CardContent>
          </Card>

          {currentCustomer && !entries.find((e) => e.customerId === currentCustomer.customerId) && (
            <Card>
              <CardHeader>
                <CardTitle>Vị trí của bạn</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <RankRow entry={currentCustomer} isMe />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function RankRow({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-6 py-3",
        isMe && "bg-primary/5 border-l-4 border-l-primary"
      )}
    >
      <div className="w-8 text-center">
        {entry.rank <= 3 ? (
          <span className="text-lg">
            {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
          </span>
        ) : (
          <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">
          {entry.customerName}
          {isMe && <span className="text-primary ml-2">(Bạn)</span>}
        </p>
      </div>
      <span className="font-bold text-sm">{entry.totalPoints} pts</span>
    </div>
  );
}
