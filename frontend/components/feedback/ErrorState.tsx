"use client";

import Link from "next/link";

export function ErrorState({ retryHref = "/dashboard" }: { retryHref?: string }) {
  return (
    <div className="feedback-state feedback-state--error" role="alert">
      <span className="eyebrow">Something went sideways</span>
      <h3>We could not load this view.</h3>
      <p>Refresh the local mock data and try again.</p>
      <Link className="button button--secondary" href={retryHref}>Try again</Link>
    </div>
  );
}
