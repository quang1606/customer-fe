"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { BottomNav } from "./bottom-nav";
import { Home, Ticket, Target, Trophy, Receipt, CreditCard, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const sidebarItems = [
  { href: "/home", label: "Trang chủ", icon: Home },
  { href: "/vouchers", label: "Voucher", icon: Ticket },
  { href: "/missions", label: "Nhiệm vụ", icon: Target },
  { href: "/leaderboard", label: "Xếp hạng", icon: Trophy },
  { href: "/invoices", label: "Hóa đơn", icon: Receipt },
  { href: "/payment", label: "Thanh toán", icon: CreditCard },
  { href: "/profile", label: "Cá nhân", icon: User },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-muted/30">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-primary">Voucher Loyalty</h1>
          {user && <p className="text-sm text-muted-foreground mt-1">Xin chào, {user.firstName}</p>}
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden border-b p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-primary">Voucher Loyalty</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <main className="flex-1 p-4 pb-20 md:pb-4 overflow-auto">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
