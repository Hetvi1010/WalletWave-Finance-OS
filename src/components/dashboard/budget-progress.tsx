import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Budget } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function BudgetProgress({ budget }: { budget: Budget }) {
  const progress = Math.min((budget.spent / budget.limit) * 100, 100);

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Budget status</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{budget.month}</p>
        </div>
        {budget.status !== "safe" && (
          <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            {budget.status === "warning" ? "Approaching limit" : "Exceeded"}
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Spent {formatCurrency(budget.spent)}</span>
          <span>Limit {formatCurrency(budget.limit)}</span>
        </div>
        <div className="rounded-2xl bg-brand-500/10 px-4 py-3 text-sm text-brand-700 dark:text-brand-300">
          {budget.remaining > 0
            ? `${formatCurrency(budget.remaining)} remaining this month.`
            : `${formatCurrency(Math.abs(budget.remaining))} over the budget cap.`}
        </div>
      </div>
    </Card>
  );
}
