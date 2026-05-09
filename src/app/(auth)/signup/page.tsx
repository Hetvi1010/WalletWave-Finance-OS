import { AuthForm } from "@/components/auth/auth-form";
import { AuthHero } from "@/components/auth/auth-hero";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthHero />
      <div className="flex w-full flex-col items-center justify-center bg-white dark:bg-slate-950 p-8 sm:p-12 lg:p-16 shadow-2xl z-10">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
