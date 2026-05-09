"use client";

import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, CircleDollarSign, LayoutDashboard, PanelLeftClose, PanelLeftOpen, PiggyBank, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

const items = [
  { href: "/dashboard" as Route, label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions" as Route, label: "Transactions", icon: CircleDollarSign },
  { href: "/budgets" as Route, label: "Budgets", icon: PiggyBank },
  { href: "/analytics" as Route, label: "Analytics", icon: BarChart3 },
  { href: "/profile" as Route, label: "Profile", icon: UserCircle2 }
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.16 }}
      className={cn(
        "hidden shrink-0 rounded-[28px] border border-white/50 bg-white/70 p-6 shadow-soft backdrop-blur-2xl lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)] lg:flex-col dark:border-white/10 dark:bg-white/5",
        collapsed ? "w-24" : "w-72"
      )}
      layout
    >
      <div className={cn("flex", collapsed ? "flex-col items-center gap-4" : "items-center justify-between")}>
        {!collapsed ? <Logo /> : <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-400 text-lg font-bold text-white shadow-glow">W</div>}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-slate-600 shadow-soft transition-all hover:bg-white dark:bg-white/10 dark:text-slate-200"
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>
      <div className="mt-10 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "flex items-center rounded-2xl text-sm font-medium transition",
                collapsed ? "justify-center p-3" : "px-4 py-3",
                active
                  ? "bg-brand-600 text-white shadow-glow dark:bg-brand-500"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              )}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {!collapsed && (
        <div className="mt-auto rounded-3xl bg-gradient-to-br from-brand-600 to-cyan-400 p-5 text-white shadow-glow">
          <p className="text-sm font-medium text-white/80">Financial health</p>
          <h3 className="mt-2 text-2xl font-semibold">Strong trajectory</h3>
          <p className="mt-2 text-sm leading-6 text-white/80">Keep spending under budget to unlock a higher savings rate next month.</p>
        </div>
      )}
    </motion.aside>
  );
}
