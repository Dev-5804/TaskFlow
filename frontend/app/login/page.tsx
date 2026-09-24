"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, status } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [router, status]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <main className="auth-page"><div className="auth-panel"><Link className="brand" href="/"><span className="brand-mark">T</span><span>TaskFlow</span></Link><div className="auth-copy"><span className="eyebrow">Welcome back</span><h1>Pick up where the good work left off.</h1><p>Sign in to return to your shared workspace.</p></div><form className="auth-form" onSubmit={submit}><label htmlFor="login-email">Email address</label><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@studio.com" required /><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required /><button className="button button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Continue"} <span aria-hidden="true">↗</span></button>{error && <p className="form-error" role="alert">{error}</p>}</form><p className="auth-footer">New to TaskFlow? <Link href="/register">Create an account</Link></p></div><div className="auth-aside"><span className="eyebrow">A quieter way to work</span><blockquote>“The next action is easier to find when everyone can see the same shape of the work.”</blockquote><span className="auth-aside__mark">TaskFlow / Studio 11</span></div></main>;
}
