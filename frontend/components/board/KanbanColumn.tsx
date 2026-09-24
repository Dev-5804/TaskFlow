import type { MockColumn, MockTask, MockUser } from "@/types/mock-data";
import { EmptyState } from "@/components/feedback/EmptyState";
import { TaskCard } from "./TaskCard";

export function KanbanColumn({ column, tasks, users }: { column: MockColumn; tasks: Record<string, MockTask>; users: MockUser[] }) {
  return <section className="kanban-column"><header className="kanban-column__header"><div><span className="column-kicker">{column.id === "todo" ? "01" : column.id === "progress" ? "02" : "03"}</span><h2>{column.title}</h2></div><span className="task-count">{column.taskIds.length}</span></header><div className="kanban-column__body">{column.taskIds.length ? column.taskIds.map((taskId) => <TaskCard key={taskId} task={tasks[taskId]} users={users} />) : <EmptyState title="A clear runway" description="Tasks added here will appear in this column." />}</div><button className="add-task-button">+ Add task</button></section>;
}
