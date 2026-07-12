/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      const redirect = searchParams.get("redirect");
      if (redirect) {
        router.push(redirect);
      } else {
        router.push(`/${user.role}`);
      }
    }
  }, [user, loading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      console.error("Login error:", err);
      const data = err.response?.data;
      if (data?.errorSources && Array.isArray(data.errorSources) && data.errorSources.length > 0) {
        const errorMsgs = data.errorSources
          .map((source: any) => {
            if (source.path) {
              const formattedPath = source.path.charAt(0).toUpperCase() + source.path.slice(1);
              return `${formattedPath}: ${source.message}`;
            }
            return source.message;
          })
          .join("\n");
        setFormError(errorMsgs);
      } else {
        setFormError(data?.message || "Invalid email or password. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen relative overflow-hidden px-4 py-12 sm:py-16 lg:py-20 bg-background">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Back link */}
      <Link
        href="/"
        className={cn(
          "absolute top-4 left-4 sm:top-6 sm:left-6",
          "flex items-center gap-1.5 text-sm font-medium text-muted-foreground",
          "hover:text-primary transition-colors duration-150 z-10"
        )}
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        Back to Home
      </Link>

      {/* Card */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md",
          "bg-card/90 backdrop-blur-xl border border-border rounded-2xl",
          "shadow-2xl shadow-primary/5 p-8 sm:p-10",
          "animate-fade-slide-up"
        )}
      >
        {/* Logo + header */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/images/logo.png" alt="Employzen Logo" width={80} height={80} className="rounded-2xl bg-white p-2.5 object-contain shadow-lg shadow-primary/25 mb-5 ring-1 ring-border/50" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground text-center font-[family-name:var(--font-heading)]">
            Welcome back to{" "}
            <span className="gradient-text">Employzen</span>
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Error alert */}
          {formError && (
            <div className="p-3.5 text-sm bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium whitespace-pre-line animate-fade-in">
              {formError}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email-address" className="block text-sm font-semibold text-foreground">
              Email Address
            </label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="gradient"
              className="w-full h-11 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-2xl gradient-brand flex items-center justify-center">
              <Loader2 className="h-7 w-7 text-white animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
