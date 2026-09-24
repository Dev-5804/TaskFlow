import Link from "next/link";
import type { MockBoard } from "@/types/mock-data";

export function BoardCard({ board }: { board: MockBoard }) {
  const taskCount = Object.keys(board.tasks).length;

  return (
    <Link className="board-card" href={`/boards/${board.id}`}>
      <div className="board-card__topline"><span className="board-card__swatch" style={{ backgroundColor: board.color }} /><span>{board.updatedAt}</span></div>
      <h3>{board.name}</h3>
      <p>{board.description}</p>
      <div className="board-card__footer"><span>{taskCount} tasks</span><span className="arrow" aria-hidden="true">↗</span></div>
    </Link>
  );
}
