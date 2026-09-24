export function LoadingState({ label = "Loading your workspace" }: { label?: string }) {
  return (
    <div className="feedback-state feedback-state--loading" role="status" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
