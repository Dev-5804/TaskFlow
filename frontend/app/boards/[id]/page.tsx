import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { ErrorState } from "@/components/feedback/ErrorState";
import { mockBoards, mockUsers } from "@/data/mock-data";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const board = mockBoards.find((candidate) => candidate.id === id);

  if (!board) {
    return <AppShell><div className="not-found-panel"><ErrorState retryHref="/dashboard" /></div></AppShell>;
  }

  return <AppShell><div className="board-page-header"><div><Link className="breadcrumb" href="/dashboard">← My boards</Link><div className="board-title"><span className="board-card__swatch" style={{ backgroundColor: board.color }} /><div><span className="eyebrow">Working room</span><h1>{board.name}</h1></div></div><p>{board.description}</p></div><div className="board-page-header__actions"><span className="presence-label"><span className="status-dot" />{mockUsers.length} online</span><button className="button button--secondary">Board settings</button></div></div><div className="board-toolbar"><span>All tasks <strong>{Object.keys(board.tasks).length}</strong></span><span className="toolbar-note">Mock board · Changes stay local</span></div><KanbanBoard board={board} users={mockUsers} /></AppShell>;
}
