"use client";

import { useState, useRef, useEffect } from "react";
import { BellDot, Bell, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Budget Limit Warning", description: "You've used 85% of your Dining out budget.", time: "10 mins ago", type: "warning", unread: true },
  { id: 2, title: "Deposit Received", description: "Salary deposit of $4,200.00 cleared.", time: "2 hours ago", type: "success", unread: true },
  { id: 3, title: "New Feature Alert", description: "Generate tax reports automatically now.", time: "1 day ago", type: "info", unread: false },
];

export function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400">Finance tracker</p>
        <h1 className="mt-2 text-3xl font-semibold">Your money, designed with clarity.</h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-[220px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-11" placeholder="Search transactions" />
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) setUnreadCount(0); // mark as read
            }}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/70 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-colors"
          >
            {unreadCount > 0 ? (
              <>
                <BellDot className="h-5 w-5 text-brand-500" />
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-950" />
              </>
            ) : (
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 lg:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-[#0A0A0A] z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    setUnreadCount(0);
                  }}
                  className="text-xs text-brand-600 dark:text-brand-400 cursor-pointer hover:underline"
                >
                  Mark all as read
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {MOCK_NOTIFICATIONS.map((notif) => (
                  <div key={notif.id} className="group relative flex gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                    <div className="mt-0.5 shrink-0">
                      {notif.type === "warning" && <AlertCircle className="h-5 w-5 text-amber-500" />}
                      {notif.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                      {notif.type === "info" && <Bell className="h-5 w-5 text-brand-500" />}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between">
                         <p className={`text-sm font-medium ${notif.unread && unreadCount > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{notif.title}</p>
                         <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                       </div>
                       <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 rounded-xl py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                View previous alerts
              </button>
            </div>
          )}
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
}
