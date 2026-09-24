"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <main className="auth-page"><div className="auth-panel"><Link className="brand" href="/"><span className="brand-mark">T</span><span>TaskFlow</span></Link><div className="auth-copy"><span className="eyebrow">Start with the shape</span><h1>Give the team a room to think in.</h1><p>Create a local mock profile now. Account persistence arrives in Phase 4.</p></div><form className="auth-form" onSubmit={submit}><label htmlFor="register-name">Your name</label><input id="register-name" type="text" placeholder="Devendra Shah" required /><label htmlFor="register-email">Email address</label><input id="register-email" type="email" placeholder="you@studio.com" required /><label htmlFor="register-password">Password</label><input id="register-password" type="password" placeholder="At least 8 characters" minLength={8} required /><button className="button button--primary" type="submit">Create profile <span aria-hidden="true">↗</span></button>{submitted && <p className="form-success" role="status">Mock profile created. Welcome to Studio 11.</p>}</form><p className="auth-footer">Already have a profile? <Link href="/login">Sign in</Link></p></div><div className="auth-aside auth-aside--warm"><span className="eyebrow">A small team advantage</span><blockquote>“Good collaboration leaves a trail of decisions, not a maze of messages.”</blockquote><span className="auth-aside__mark">TaskFlow / First session</span></div></main>;
}
