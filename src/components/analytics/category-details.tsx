"use client";

import { Briefcase, Coffee, Plane, Receipt, ShoppingCart, Tv, HeartPulse, Laptop, PiggyBank, CircleDollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnalyticsCategory } from "@/types";
import { cn } from "@/lib/utils";

const getCategoryStyle = (category: string) => {
  switch (category) {
    case "Salary": return { icon: <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-500/10" };
    case "Food": return { icon: <Coffee className="h-4 w-4 text-amber-600 dark:text-amber-400" />, bg: "bg-amber-500/10" };
    case "Travel": return { icon: <Plane className="h-4 w-4 text-sky-600 dark:text-sky-400" />, bg: "bg-sky-500/10" };
    case "Bills": return { icon: <Receipt className="h-4 w-4 text-rose-600 dark:text-rose-400" />, bg: "bg-rose-500/10" };
    case "Shopping": return { icon: <ShoppingCart className="h-4 w-4 text-pink-600 dark:text-pink-400" />, bg: "bg-pink-500/10" };
    case "Entertainment": return { icon: <Tv className="h-4 w-4 text-purple-600 dark:text-purple-400" />, bg: "bg-purple-500/10" };
    case "Health": return { icon: <HeartPulse className="h-4 w-4 text-red-600 dark:text-red-400" />, bg: "bg-red-500/10" };
    case "Freelance": return { icon: <Laptop className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />, bg: "bg-indigo-500/10" };
    case "Savings": return { icon: <PiggyBank className="h-4 w-4 text-teal-600 dark:text-teal-400" />, bg: "bg-teal-500/10" };
    case "Bills & Utilities": return { icon: <Receipt className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />, bg: "bg-indigo-500/10" };
    case "Food & Dining": return { icon: <Coffee className="h-4 w-4 text-amber-600 dark:text-amber-400" />, bg: "bg-amber-500/10" };
    case "Healthcare": return { icon: <HeartPulse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-500/10" };
    case "Transportation": return { icon: <Plane className="h-4 w-4 text-amber-600 dark:text-amber-400" />, bg: "bg-amber-500/10" };
    default: return { icon: <CircleDollarSign className="h-4 w-4 text-slate-600 dark:text-slate-400" />, bg: "bg-slate-500/10" };
  }
};

export function CategoryDetails({ data, totalExpense }: { data: AnalyticsCategory[], totalExpense: number }) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = totalExpense || sortedData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="p-5 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Category Details</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Breakdown by spending</p>
      </div>
      <div className="flex-1 space-y-6">
        {sortedData.map((item) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
          const style = getCategoryStyle(item.name);
          
          return (
            <div key={item.name} className="flex flex-col gap-3">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", style.bg)}>
                     {style.icon}
                   </div>
                   <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{item.name}</span>
                 </div>
                 <span className="font-bold text-slate-900 px-1 py-0.5 rounded dark:text-white">${item.value}</span>
               </div>
               <div className="flex items-center gap-3 pl-14">
                 <div className="relative h-2.5 rounded-full w-full bg-slate-100 dark:bg-slate-800">
                    <div 
                      className="absolute left-0 top-0 h-full rounded-full transition-all" 
                      style={{ width: `${percentage}%`, backgroundColor: item.fill || '#4f46e5' }} 
                    />
                 </div>
                 <span className="text-[11px] font-medium text-slate-400 w-8">{percentage}%</span>
               </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
