"use client";

import { useMemo, useState } from "react";
import { Pencil, Search, Trash2, Briefcase, Coffee, Plane, Receipt, ShoppingCart, Tv, HeartPulse, Laptop, PiggyBank, CircleDollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

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

export function TransactionsTable({
  transactions,
  onAdd,
  onDelete,
  onEdit
}: {
  transactions: Transaction[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(
    () =>
      transactions.filter((item) => {
        const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "All" || item.category === category;
        return matchesQuery && matchesCategory;
      }),
    [category, query, transactions]
  );

  return (
    <Card className="p-5">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Transactions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Search, filter, and manage your money movement</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" placeholder="Search" />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-12 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm dark:border-white/10 dark:bg-black/20"
          >
            <option>All</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <Button onClick={onAdd} className="h-12 w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white dark:bg-brand-500">
            Add Transaction
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {filtered.length ? (
          filtered.map((transaction) => {
            const style = getCategoryStyle(transaction.category);
            return (
              <div
                key={transaction._id}
                className="flex flex-col gap-4 rounded-2xl border border-white/40 bg-white/60 p-4 text-sm sm:flex-row sm:items-center dark:border-white/10 dark:bg-black/20"
              >
                <div className="flex flex-1 items-center gap-4">
                  <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", style.bg)}>
                    {style.icon}
                  </div>
                  <div>
                    <p className="text-base font-semibold">{transaction.title}</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className={cn("rounded-lg px-2.5 py-0.5 text-xs font-medium", style.bg, style.text)}>
                        {transaction.category}
                      </span>
                      <span className="text-slate-400">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                  <div className={cn("text-lg font-bold", transaction.type === "income" ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500")}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(transaction)} className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </button>
                    <button onClick={() => onDelete(transaction._id)} className="rounded-xl p-2 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            title="Nothing matches this filter"
            description="Try a different search term or category, or add a new transaction to get started."
          />
        )}
      </div>
    </Card>
  );
}
