"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function SummaryCard({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="h-full p-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-4 text-3xl font-semibold">{value}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
      </Card>
    </motion.div>
  );
}
