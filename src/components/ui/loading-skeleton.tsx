export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-[linear-gradient(110deg,rgba(255,255,255,0.06),rgba(255,255,255,0.16),rgba(255,255,255,0.06))] bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  );
}
