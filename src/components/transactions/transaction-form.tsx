"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FormValues {
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

export function TransactionForm({
  onSubmit,
  onClose,
  initialValues,
  isEdit
}: {
  onSubmit: (values: FormValues) => Promise<void>;
  onClose: () => void;
  initialValues?: Partial<FormValues>;
  isEdit?: boolean;
}) {
  const { register, handleSubmit, reset, formState, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      title: initialValues?.title || "",
      amount: initialValues?.amount || 0,
      type: "expense",
      category: initialValues?.category || "Food",
      date: initialValues?.date || new Date().toISOString().slice(0, 10),
      ...initialValues
    }
  });

  useEffect(() => {
    reset({
      title: initialValues?.title || "",
      amount: initialValues?.amount || 0,
      type: initialValues?.type || "expense",
      category: initialValues?.category || "Food",
      date: initialValues?.date || new Date().toISOString().slice(0, 10)
    });
  }, [initialValues, reset]);

  const currentType = watch("type") || "expense";

  const submit = async (values: FormValues) => {
    await onSubmit(values);
    toast.success(isEdit ? "Transaction updated" : "Transaction added");
    reset();
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
          <h2 className="text-2xl font-bold dark:text-white">{isEdit ? "Edit Transaction" : "Add Transaction"}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-5">
          {/* Custom Toggle */}
          <div className="flex w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-1 dark:border-white/10 dark:bg-black/20">
             <div className="flex w-full">
               <button
                 type="button"
                 onClick={() => setValue("type", "expense", { shouldDirty: true })}
                 className={cn(
                   "flex-1 rounded-xl py-2 text-center text-sm font-medium transition-all",
                   currentType === "expense"
                     ? "bg-white text-rose-500 shadow-sm dark:bg-slate-800 font-semibold"
                     : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                 )}
               >
                 Expense
               </button>
               <button
                 type="button"
                 onClick={() => setValue("type", "income", { shouldDirty: true })}
                 className={cn(
                   "flex-1 rounded-xl py-2 text-center text-sm font-medium transition-all",
                   currentType === "income"
                     ? "bg-white text-emerald-500 shadow-sm dark:bg-slate-800 font-semibold"
                     : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                 )}
               >
                 Income
               </button>
             </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400">Amount</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <Input type="number" step="0.01" placeholder="0.00" className="pl-8" {...register("amount", { required: true, valueAsNumber: true })} />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400">Category</label>
              <select {...register("category")} className="mt-1 w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm dark:border-white/10 dark:bg-slate-900">
                <option value="" disabled>Select category</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400">Description</label>
               <Input placeholder="What was this for?" className="mt-1" {...register("title", { required: true })} />
            </div>

            <div>
               <label className="text-sm text-slate-600 dark:text-slate-400">Date</label>
               <Input type="date" className="mt-1" {...register("date", { required: true })} />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button type="button" variant="secondary" className="w-full" onClick={onClose} size="lg">Cancel</Button>
            <Button 
              type="submit" 
              className={cn(
                "w-full text-white transition-colors",
                currentType === "expense" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
              )} 
              size="lg" 
              disabled={formState.isSubmitting}
            >
              {isEdit ? "Update" : currentType === "expense" ? "Add Expense" : "Add Income"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
