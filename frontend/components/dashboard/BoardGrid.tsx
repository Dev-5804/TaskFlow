import type { MockBoard } from "@/types/mock-data";
import { BoardCard } from "./BoardCard";

export function BoardGrid({ boards }: { boards: MockBoard[] }) {
  if (boards.length === 0) return <div className="empty-inline">No boards yet. Create the first one to get moving.</div>;
  return <div className="board-grid">{boards.map((board) => <BoardCard board={board} key={board.id} />)}</div>;
}
