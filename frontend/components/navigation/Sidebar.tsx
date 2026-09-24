import Link from "next/link";
import { mockBoards, mockWorkspace } from "@/data/mock-data";
import { navigationItems } from "@/lib/navigation";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__intro">
        <span className="eyebrow">Your space</span>
        <h2>{mockWorkspace.name}</h2>
        <p>{mockWorkspace.description}</p>
      </div>
      <nav aria-label="Primary navigation">
        <span className="sidebar__label">Navigate</span>
        {navigationItems.map((item) => <Link className="sidebar-link" href={item.href} key={item.href}><span className="sidebar-link__index">{item.icon}</span>{item.label}</Link>)}
      </nav>
      <nav className="sidebar__boards" aria-label="Boards">
        <div className="sidebar__label-row"><span className="sidebar__label">Boards</span><span className="sidebar__count">{mockBoards.length}</span></div>
        {mockBoards.map((board) => <Link className="board-link" href={`/boards/${board.id}`} key={board.id}><span className="board-link__dot" style={{ backgroundColor: board.color }} />{board.name}</Link>)}
      </nav>
      <div className="sidebar__footer"><span className="status-dot" />All systems ready</div>
    </aside>
  );
}
