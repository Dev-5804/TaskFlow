import type { MockTask, MockUser } from "@/types/mock-data";

const priorityLabels = { LOW: "Low", MEDIUM: "Medium", HIGH: "High", URGENT: "Urgent" };

export function TaskCard({ task, users }: { task: MockTask; users: MockUser[] }) {
  const assignee = users.find((user) => user.id === task.assigneeId);
  return <article className="task-card"><div className={`priority priority--${task.priority.toLowerCase()}`}>{priorityLabels[task.priority]}</div><h3>{task.title}</h3><p>{task.description}</p><div className="task-card__meta">{assignee ? <span className="avatar avatar--tiny" style={{ backgroundColor: assignee.avatarColor }}>{assignee.initials}</span> : <span />}{task.dueDate && <span>{task.dueDate}</span>}</div></article>;
}
