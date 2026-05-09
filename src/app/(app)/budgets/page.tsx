"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Target, Lightbulb, Wallet, Calculator, AlertTriangle, Sparkles, PieChart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { BudgetForm } from "@/components/budgets/budget-form";
import { api } from "@/lib/api";
import { Budget, DashboardData } from "@/types";

function getDaysLeftInMonth(date = new Date()) {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Math.max(lastDay - date.getDate(), 1);
}

export default function BudgetsPage() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false);

  useEffect(() => {
    Promise.all([api.getBudget(), api.getDashboard()])
      .then(([budgetValue, dashboardValue]) => {
        setBudget(budgetValue);
        setDashboard(dashboardValue);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load budget data");
      })
      .finally(() => setLoading(false));
  }, []);

  const saveBudget = async ({ limit }: { limit: number }) => {
    const nextLimit = Number(limit);
    if (!Number.isFinite(nextLimit) || nextLimit <= 0) {
      toast.error("Budget limit must be greater than zero");
      return;
    }

    try {
      setSaving(true);
      const nextBudget = await api.setBudget({ limit: nextLimit });
      const nextDashboard = await api.getDashboard();
      setBudget(nextBudget);
      setDashboard(nextDashboard);
      setIsBudgetFormOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update budget");
    } finally {
      setSaving(false);
    }
  };

  const daysLeft = getDaysLeftInMonth();
  const remainingBudget = budget ? budget.remaining : 0;
  const safeToSpend = remainingBudget > 0 ? (remainingBudget / daysLeft).toFixed(2) : "0.00";
  const burnRateLabel =
    budget?.status === "exceeded" ? "High" : budget?.status === "warning" ? "Medium" : "Healthy";
  const categoryBudgets = dashboard?.categoryBreakdown || [];
  const budgetMonth = budget?.month || "Current Month";
  const hasExistingBudget = Boolean(budget?._id);

  return (
    <div className="space-y-8 pb-10">
      {isBudgetFormOpen && (
        <BudgetForm
          month={budgetMonth}
          initialLimit={budget?.limit || 0}
          hasExistingBudget={hasExistingBudget}
          onSubmit={saveBudget}
          onClose={() => setIsBudgetFormOpen(false)}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Planner</h1>
          <p className="mt-2 text-slate-500">Set limits, monitor your spending, and hit your financial goals without friction.</p>
        </div>
        <Button
          className="h-12 w-full bg-brand-600 text-white hover:bg-brand-700 sm:w-auto"
          onClick={() => setIsBudgetFormOpen(true)}
          disabled={loading || saving}
        >
          <Plus className="mr-2 h-4 w-4" />
          {hasExistingBudget ? "Edit Budget" : "Add Budget"}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {loading ? <LoadingSkeleton className="h-72" /> : budget ? <BudgetProgress budget={budget} /> : null}

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="group relative overflow-hidden border-brand-100 p-6 dark:border-brand-900/30">
              <div className="absolute right-0 top-0 p-4 opacity-5 transition-duration-500 group-hover:opacity-10">
                <Calculator className="h-16 w-16 text-brand-500" />
              </div>
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-2 flex items-center gap-2 text-brand-600 dark:text-brand-400">
                  <Wallet className="h-5 w-5" />
                  <h3 className="font-semibold">Daily Safe Spend</h3>
                </div>
                <p className="mt-1 text-3xl font-bold">${safeToSpend}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                  You can safely spend this amount every day for the remaining {daysLeft} days of the month without breaking your budget.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-amber-100 bg-amber-50/30 p-6 dark:border-amber-900/30 dark:bg-amber-950/5">
              <div className="absolute right-0 top-0 p-4 opacity-5 transition-duration-500 group-hover:opacity-10">
                <AlertTriangle className="h-16 w-16 text-amber-500" />
              </div>
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-2 flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-semibold">Burn Rate Alert</h3>
                </div>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{burnRateLabel}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                  {budget?.status === "exceeded"
                    ? "You are already over the monthly limit. Consider reducing non-essential spending."
                    : budget?.status === "warning"
                      ? "You are getting close to your monthly limit. Keep an eye on bigger purchases."
                      : "Your current spending pace is healthy and within your monthly target."}
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex h-full flex-col gap-6">
          <Card className="shrink-0 overflow-hidden p-0 shadow-sm">
            <div className="border-b border-slate-100 p-6 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-semibold">
                    <Target className="h-5 w-5 text-brand-500" />
                    {hasExistingBudget ? "Monthly Budget" : "Add Monthly Budget"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {hasExistingBudget
                      ? "Review your current cap and open the form anytime to update it."
                      : "Start by adding a monthly budget so your spending progress can be tracked clearly."}
                  </p>
                </div>
                <Button variant="secondary" className="hidden sm:inline-flex" onClick={() => setIsBudgetFormOpen(true)}>
                  {hasExistingBudget ? "Edit" : "Add"}
                </Button>
              </div>
            </div>
            <div className="space-y-5 bg-slate-50 p-6 dark:bg-slate-900/20">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Budget Month</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{budgetMonth}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Budget Limit</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : `$${(budget?.limit || 0).toFixed(2)}`}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {hasExistingBudget
                    ? "This is the monthly cap currently applied to your spending."
                    : "No custom budget is saved yet. Add one to start tracking against a fixed limit."}
                </p>
              </div>
              <Button
                className="h-11 w-full text-base font-medium transition-transform active:scale-[0.98]"
                onClick={() => setIsBudgetFormOpen(true)}
                disabled={loading || saving}
              >
                {hasExistingBudget ? "Update Budget" : "Add Budget"}
              </Button>
            </div>
          </Card>

          <Card className="relative flex flex-1 flex-col justify-center overflow-hidden border-none bg-gradient-to-br from-brand-500 to-emerald-500 p-8 text-white shadow-xl shadow-brand-500/20">
            <div className="pointer-events-none absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 scale-150 opacity-10">
              <Sparkles className="h-40 w-40" />
            </div>
            <div className="relative z-10 flex gap-4">
              <div className="mt-1 shrink-0">
                <Lightbulb className="h-8 w-8 text-brand-100" />
              </div>
              <div>
                <h3 className="text-xl font-semibold drop-shadow-md">Smart Insights</h3>
                <p className="mt-4 text-sm font-medium leading-relaxed text-brand-50 drop-shadow-sm">
                  WalletWave continuously monitors your spending patterns.
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-brand-100 drop-shadow-sm">
                  {budget
                    ? `You have ${budget.remaining >= 0 ? `$${budget.remaining.toFixed(2)} left` : `$${Math.abs(budget.remaining).toFixed(2)} overspent`} for ${budget.month}.`
                    : "Your budget performance will appear here once your account data loads."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <PieChart className="h-6 w-6 text-brand-500" />
            Category Allocations
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">Based on current backend transactions</span>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-52" />
            ))}
          </div>
        ) : categoryBudgets.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categoryBudgets.map((cat) => {
              const progress = budget?.limit ? Math.min((cat.value / budget.limit) * 100, 100) : 0;
              const remaining = Math.max((budget?.limit || 0) - cat.value, 0);

              return (
                <Card key={cat.name} className="p-5 transition-shadow hover:shadow-md">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.fill }} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Share of Budget</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{progress.toFixed(1)}%</p>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold">{cat.name}</h3>
                  <p className="mt-1 text-2xl font-bold">${cat.value.toFixed(2)}</p>
                  <p className="mt-1 text-sm text-slate-500">${remaining.toFixed(2)} remaining against your monthly limit</p>

                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%`, backgroundColor: cat.fill }}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6">
            <h3 className="text-lg font-semibold">No spending categories yet</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Add expense transactions from the transactions form and your real category breakdown will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
