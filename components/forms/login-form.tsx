"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { login } from "@/lib/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    const result = await login(values);
    if (!result.ok) {
      toast.error("Couldn't sign in", { description: result.error });
      return;
    }
    const destination = searchParams.get("from") || "/admin";
    router.replace(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field label="Email" required error={errors.email?.message}>
        {(props) => (
          <Input
            {...props}
            {...register("email")}
            type="email"
            autoComplete="username"
            autoFocus
          />
        )}
      </Field>

      <Field label="Password" required error={errors.password?.message}>
        {(props) => (
          <Input
            {...props}
            {...register("password")}
            type="password"
            autoComplete="current-password"
          />
        )}
      </Field>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
