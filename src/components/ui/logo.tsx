export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-400 text-lg font-bold text-white shadow-glow">
        W
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400">WalletWave</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Finance OS</p>
      </div>
    </div>
  );
}
