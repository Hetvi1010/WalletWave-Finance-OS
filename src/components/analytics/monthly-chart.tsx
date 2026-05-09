"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { AnalyticsMonthly } from "@/types";

export function MonthlyChart({ data }: { data: AnalyticsMonthly[] }) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Income vs Expense</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Last 6 months overview</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="income" fill="#4f46e5" radius={[12, 12, 0, 0]} animationDuration={1200} />
            <Bar dataKey="expense" fill="#06b6d4" radius={[12, 12, 0, 0]} animationDuration={1400} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
