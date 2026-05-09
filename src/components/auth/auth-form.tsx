"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2)
});

type Mode = "login" | "signup";
type AuthFormValues = {
  name?: string;
  email: string;
  password: string;
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const schema = mode === "login" ? loginSchema : signupSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const onSubmit = async (values: AuthFormValues) => {
    try {
      if (mode === "login") {
        await login(values.email, values.password);
      } else {
        await signup(values.name || "", values.email, values.password);
      }
      toast.success(mode === "login" ? "Welcome back" : "Account created");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">{mode === "login" ? "Sign in" : "Create new account"}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {mode === "login" ? "Enter your email to continue" : "Enter your details to create a new account"}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {mode === "signup" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Full name</label>
            <Input placeholder="Avery Carter" {...register("name")} />
            {errors.name && <p className="text-sm text-rose-500">{errors.name.message}</p>}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input placeholder="hello@walletwave.app" {...register("email")} />
          {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Input type={showPassword ? "text" : "password"} placeholder="Enter password" {...register("password")} />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-rose-500">{errors.password.message}</p>}
        </div>
        <Button className="w-full mt-4" size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create new account"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link className="font-medium text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:underline" href={mode === "login" ? "/signup" : "/login"} prefetch>
          {mode === "login" ? "Create one" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
