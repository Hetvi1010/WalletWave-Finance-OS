"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { AnalyticsCategory } from "@/types";

export function CategoryChart({ data }: { data: AnalyticsCategory[] }) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Expense categories</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Distribution of your spending</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={0} outerRadius={110} stroke="#fff" strokeWidth={2} paddingAngle={0} isAnimationActive animationDuration={1000} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        {data.map((item) => {
           const total = data.reduce((acc, curr) => acc + curr.value, 0);
           const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
           return (
            <div key={item.name} className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.fill }} />
              <span>{item.name} ({percentage}%)</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
