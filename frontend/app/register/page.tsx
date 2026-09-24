"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register, status } = useAuth();
  const [name, setName] = useState("");
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
      await register(name, email, password);
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create your account");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <main className="auth-page"><div className="auth-panel"><Link className="brand" href="/"><span className="brand-mark">T</span><span>TaskFlow</span></Link><div className="auth-copy"><span className="eyebrow">Start with the shape</span><h1>Give the team a room to think in.</h1><p>Create your account and step into a shared workspace.</p></div><form className="auth-form" onSubmit={submit}><label htmlFor="register-name">Your name</label><input id="register-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Devendra Shah" required /><label htmlFor="register-email">Email address</label><input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@studio.com" required /><label htmlFor="register-password">Password</label><input id="register-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required /><button className="button button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create profile"} <span aria-hidden="true">↗</span></button>{error && <p className="form-error" role="alert">{error}</p>}</form><p className="auth-footer">Already have a profile? <Link href="/login">Sign in</Link></p></div><div className="auth-aside auth-aside--warm"><span className="eyebrow">A small team advantage</span><blockquote>“Good collaboration leaves a trail of decisions, not a maze of messages.”</blockquote><span className="auth-aside__mark">TaskFlow / First session</span></div></main>;
}
