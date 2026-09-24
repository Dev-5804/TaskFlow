"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <main className="auth-page"><div className="auth-panel"><Link className="brand" href="/"><span className="brand-mark">T</span><span>TaskFlow</span></Link><div className="auth-copy"><span className="eyebrow">Welcome back</span><h1>Pick up where the good work left off.</h1><p>This Phase 2 form is local-only. Authentication arrives in Phase 4.</p></div><form className="auth-form" onSubmit={submit}><label htmlFor="login-email">Email address</label><input id="login-email" type="email" placeholder="you@studio.com" required /><label htmlFor="login-password">Password</label><input id="login-password" type="password" placeholder="Your password" required /><button className="button button--primary" type="submit">Continue <span aria-hidden="true">↗</span></button>{submitted && <p className="form-success" role="status">Mock sign-in complete. Your workspace is ready.</p>}</form><p className="auth-footer">New to TaskFlow? <Link href="/register">Create an account</Link></p></div><div className="auth-aside"><span className="eyebrow">A quieter way to work</span><blockquote>“The next action is easier to find when everyone can see the same shape of the work.”</blockquote><span className="auth-aside__mark">TaskFlow / Studio 11</span></div></main>;
}
