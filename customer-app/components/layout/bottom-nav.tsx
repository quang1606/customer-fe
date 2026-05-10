"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Ticket, Target, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Trang chủ", icon: Home },
  { href: "/vouchers", label: "Voucher", icon: Ticket },
  { href: "/missions", label: "Nhiệm vụ", icon: Target },
  { href: "/leaderboard", label: "Xếp hạng", icon: Trophy },
  { href: "/profile", label: "Cá nhân", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 text-xs",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
