export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="feedback-state">
      <span className="eyebrow">Nothing here yet</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
