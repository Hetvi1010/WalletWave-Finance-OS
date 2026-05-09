

import { Logo } from "@/components/ui/logo";

export function AuthHero() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex border-r border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
      {/* Logo at the top left */}
      <div className="relative z-10">
        <Logo />
      </div>

      {/* Center Decorative UI */}
      <div className="relative flex flex-1 items-center justify-center p-8">
        <div className="relative w-full max-w-sm">
          {/* Background glows */}
          <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-brand-500/20 blur-[64px]" />
          <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[64px]" />

          {/* Floating cards */}
          <div className="relative space-y-6">
            <div className="animate-float overflow-hidden rounded-2xl border border-slate-200/50 bg-white/50 dark:border-white/10 dark:bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Balance</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">$24,560.80</p>
                </div>
                <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  +12.5%
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20">
                  <div className="h-4 w-4 rounded-full bg-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Apple Inc. Dividend</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Just now</p>
                </div>
                <div className="ml-auto text-sm font-medium text-emerald-600 dark:text-emerald-400">+$450.00</div>
              </div>
            </div>

            <div 
              className="animate-float ml-auto w-4/5 overflow-hidden rounded-2xl border border-slate-200/50 bg-white/50 dark:border-white/10 dark:bg-white/5 p-5 shadow-2xl backdrop-blur-xl" 
              style={{ animationDelay: "1s" }}
            >
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Expenses</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">$4,210.00</p>
                <div className="flex gap-1.5 pb-1">
                  <div className="h-4 w-1.5 rounded-full bg-brand-500/40" />
                  <div className="h-6 w-1.5 rounded-full bg-brand-500/60" />
                  <div className="h-8 w-1.5 rounded-full bg-brand-500" />
                  <div className="h-5 w-1.5 rounded-full bg-brand-500/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text at the bottom */}
      <div className="relative z-10 max-w-md space-y-4">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">
          A quiet financial notebook you actually want to open.
        </h2>
        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Track your wealth, manage budgets, and stay in control of your financial future with a calm, focused workspace.
        </p>
      </div>
    </div>
  );
}
