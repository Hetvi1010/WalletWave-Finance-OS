import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 dark:border-white/10 dark:bg-black/20 dark:text-white",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
