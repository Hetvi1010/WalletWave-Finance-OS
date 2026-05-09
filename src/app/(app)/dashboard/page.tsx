"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { DashboardData } from "@/types";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { CategoryChart } from "@/components/analytics/category-chart";
import { MonthlyChart } from "@/components/analytics/monthly-chart";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.getDashboard().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-36" />
          ))}
        </div>
        <LoadingSkeleton className="h-80" />
        <LoadingSkeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total balance" value={formatCurrency(data.summary.totalBalance)} helper="Current available funds" />
        <SummaryCard label="Income" value={formatCurrency(data.summary.totalIncome)} helper="Combined monthly inflow" />
        <SummaryCard label="Expenses" value={formatCurrency(data.summary.totalExpense)} helper="Combined monthly outflow" />
        <SummaryCard label="Savings rate" value={formatPercentage(data.summary.savingsRate)} helper="Month-over-month performance" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MonthlyChart data={data.monthlyOverview} />
        <BudgetProgress budget={data.budget} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <CategoryChart data={data.categoryBreakdown} />
        <RecentTransactions transactions={data.recentTransactions} />
      </section>
    </div>
  );
}
