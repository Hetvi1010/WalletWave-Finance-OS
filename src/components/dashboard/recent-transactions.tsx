import { Briefcase, Coffee, Plane, Receipt, ShoppingCart, Tv, HeartPulse, Laptop, PiggyBank, CircleDollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Transaction } from "@/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

const getCategoryStyle = (category: string) => {
  switch (category) {
    case "Salary": return { icon: <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" };
    case "Food": return { icon: <Coffee className="h-5 w-5 text-amber-600 dark:text-amber-400" />, bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" };
    case "Travel": return { icon: <Plane className="h-5 w-5 text-sky-600 dark:text-sky-400" />, bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" };
    case "Bills": return { icon: <Receipt className="h-5 w-5 text-rose-600 dark:text-rose-400" />, bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" };
    case "Shopping": return { icon: <ShoppingCart className="h-5 w-5 text-pink-600 dark:text-pink-400" />, bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" };
    case "Entertainment": return { icon: <Tv className="h-5 w-5 text-purple-600 dark:text-purple-400" />, bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" };
    case "Health": return { icon: <HeartPulse className="h-5 w-5 text-red-600 dark:text-red-400" />, bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" };
    case "Freelance": return { icon: <Laptop className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />, bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" };
    case "Savings": return { icon: <PiggyBank className="h-5 w-5 text-teal-600 dark:text-teal-400" />, bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400" };
    default: return { icon: <CircleDollarSign className="h-5 w-5 text-slate-600 dark:text-slate-400" />, bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400" };
  }
};

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Recent transactions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">A quick glance at your latest activity</p>
        </div>
      </div>
      <div className="space-y-3">
        {transactions.length ? (
          transactions.map((transaction) => {
            const income = transaction.type === "income";
            const style = getCategoryStyle(transaction.category);
            
            return (
              <div
                key={transaction._id}
                className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 p-4 dark:border-white/10 dark:bg-black/20"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", style.bg)}>
                    {style.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", style.bg, style.text)}>
                        {transaction.category}
                      </span>
                      <span className="text-xs text-slate-400">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                <div className={cn("font-bold", income ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500")}>
                  {income ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            title="No transactions yet"
            description="Start by adding your first expense or income entry and the dashboard will come alive."
          />
        )}
      </div>
    </Card>
  );
}
