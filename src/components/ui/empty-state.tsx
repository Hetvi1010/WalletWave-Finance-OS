import Image from "next/image";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-white/10">
      <Image
        src="/illustrations/empty-wallet.svg"
        alt="Empty wallet illustration"
        width={240}
        height={165}
        className="mx-auto mb-5"
      />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
