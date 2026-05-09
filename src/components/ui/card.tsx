import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-white/50 bg-white/75 p-5 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      {children}
    </div>
  );
}
