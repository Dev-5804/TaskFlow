import type { MockBoard, MockUser } from "@/types/mock-data";
import { KanbanColumn } from "./KanbanColumn";

export function KanbanBoard({ board, users }: { board: MockBoard; users: MockUser[] }) {
  return <div className="kanban-board">{board.columns.map((column) => <KanbanColumn column={column} tasks={board.tasks} users={users} key={column.id} />)}</div>;
}
