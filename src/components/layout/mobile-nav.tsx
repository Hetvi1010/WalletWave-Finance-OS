"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CircleDollarSign, LayoutDashboard, PiggyBank, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard" as Route, label: "Home", icon: LayoutDashboard },
  { href: "/transactions" as Route, label: "Txns", icon: CircleDollarSign },
  { href: "/budgets" as Route, label: "Budget", icon: PiggyBank },
  { href: "/analytics" as Route, label: "Charts", icon: BarChart3 },
  { href: "/profile" as Route, label: "Profile", icon: UserCircle2 }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 rounded-[24px] border border-white/50 bg-white/80 p-2 shadow-soft backdrop-blur-2xl lg:hidden dark:border-white/10 dark:bg-black/40">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl px-2 py-3 text-[11px] font-medium transition",
                active ? "bg-brand-600 text-white" : "text-slate-500 dark:text-slate-300"
              )}
            >
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
