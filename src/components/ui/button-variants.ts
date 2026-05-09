import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white shadow-glow hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600",
        secondary:
          "border border-white/50 bg-white/70 text-slate-700 shadow-soft backdrop-blur-xl hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10",
        ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-white"
      },
      size: {
        sm: "h-10 px-4",
        md: "h-12 px-5",
        lg: "h-14 px-6",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
