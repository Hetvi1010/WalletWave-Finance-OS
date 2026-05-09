"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { api } from "@/lib/api";
import { DashboardData } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CategoryChart } from "@/components/analytics/category-chart";
import { CategoryDetails } from "@/components/analytics/category-details";
import { MonthlyChart } from "@/components/analytics/monthly-chart";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.getDashboard().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-3">
           <LoadingSkeleton className="h-40" />
           <LoadingSkeleton className="h-40" />
           <LoadingSkeleton className="h-40" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <LoadingSkeleton className="h-80" />
          <LoadingSkeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Visualize your financial patterns</p>
      </div>

      {/* Top Row: Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
        <Card className="p-5">
           <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
             <TrendingUp className="h-5 w-5" />
           </div>
           <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.summary.totalIncome)}</p>
           <p className="mt-1 text-sm font-medium text-slate-500">Total Income</p>
        </Card>

        <Card className="p-5">
           <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
             <TrendingDown className="h-5 w-5" />
           </div>
           <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.summary.totalExpense)}</p>
           <p className="mt-1 text-sm font-medium text-slate-500">Total Expense</p>
        </Card>

        <Card className="p-5">
           <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
             <DollarSign className="h-5 w-5" />
           </div>
           <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.summary.totalBalance)}</p>
           <p className="mt-1 text-sm font-medium text-slate-500">Net Balance</p>
        </Card>
      </div>

      {/* Middle Row: Category Breakdown */}
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr] lg:gap-6">
        <CategoryChart data={data.categoryBreakdown} />
        <CategoryDetails data={data.categoryBreakdown} totalExpense={data.summary.totalExpense} />
      </div>

      {/* Bottom Row: Bar Chart */}
      <MonthlyChart data={data.monthlyOverview} />
    </div>
  );
}
