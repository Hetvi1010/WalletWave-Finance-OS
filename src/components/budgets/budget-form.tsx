"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { PiggyBank, Target, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BudgetFormValues {
  limit: number;
}

export function BudgetForm({
  month,
  initialLimit,
  hasExistingBudget,
  onSubmit,
  onClose
}: {
  month: string;
  initialLimit: number;
  hasExistingBudget: boolean;
  onSubmit: (values: BudgetFormValues) => Promise<void>;
  onClose: () => void;
}) {
  const { register, handleSubmit, reset, formState } = useForm<BudgetFormValues>({
    defaultValues: { limit: initialLimit }
  });

  useEffect(() => {
    reset({ limit: initialLimit });
  }, [initialLimit, reset]);

  const submit = async (values: BudgetFormValues) => {
    await onSubmit(values);
    toast.success(hasExistingBudget ? "Budget updated" : "Budget added");
    onClose();
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {hasExistingBudget ? "Edit Budget" : "Add Budget"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Set your spending limit for {month}.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-5">
          <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 dark:border-brand-900/30 dark:bg-brand-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm dark:bg-slate-900 dark:text-brand-400">
                <PiggyBank className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Budget Month</p>
                <p className="font-semibold text-slate-900 dark:text-white">{month}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600 dark:text-slate-400">Monthly Limit</label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-8"
                {...register("limit", { required: true, valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
            <div className="flex items-start gap-3">
              <Target className="mt-0.5 h-5 w-5 text-brand-500" />
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Pick a limit that fits your income and your savings goal. You can come back and adjust it any time.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button type="button" variant="secondary" className="w-full" onClick={onClose} size="lg">
              Cancel
            </Button>
            <Button type="submit" className="w-full bg-brand-600 text-white hover:bg-brand-700" size="lg" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Saving..." : hasExistingBudget ? "Update Budget" : "Add Budget"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
