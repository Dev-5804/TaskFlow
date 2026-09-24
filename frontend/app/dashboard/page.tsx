"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { BoardGrid } from "@/components/dashboard/BoardGrid";
import { CreateBoardForm } from "@/components/dashboard/CreateBoardForm";
import { LoadingState } from "@/components/feedback/LoadingState";
import { mockActivities, mockBoards, mockUsers, mockWorkspace } from "@/data/mock-data";
import type { MockBoard } from "@/types/mock-data";

export default function DashboardPage() {
  const [boards, setBoards] = useState(mockBoards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, []);

  function addBoard(board: MockBoard) {
    setBoards((currentBoards) => [...currentBoards, board]);
  }

  return <AppShell>{isLoading ? <LoadingState /> : <><div className="page-header"><div><span className="eyebrow">Wednesday / September 24</span><h1>Good morning, Devendra.</h1><p>Here is the shape of the work across {mockWorkspace.name}.</p></div><CreateBoardForm onCreate={addBoard} /></div><section className="metric-strip" aria-label="Workspace summary"><div><span className="metric-label">Active boards</span><strong>{boards.length}</strong></div><div><span className="metric-label">Teammates</span><strong>{mockWorkspace.members.length}</strong></div><div><span className="metric-label">Open tasks</span><strong>{boards.reduce((total, board) => total + Object.keys(board.tasks).length, 0)}</strong></div><div className="metric-strip__note"><span className="status-dot" />Everything is moving</div></section><section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">Your working rooms</span><h2>My Boards</h2></div><span className="section-heading__count">{boards.length.toString().padStart(2, "0")} rooms</span></div><BoardGrid boards={boards} /></section><section className="dashboard-section activity-section"><div className="section-heading"><div><span className="eyebrow">A little context</span><h2>Recent activity</h2></div><span className="section-heading__count">Live feed</span></div><div className="activity-list">{mockActivities.map((activity) => <div className="activity-item" key={activity.id}><span className="avatar" style={{ backgroundColor: activity.actor.avatarColor }}>{activity.actor.initials}</span><p><strong>{activity.actor.name}</strong> {activity.action} <b>{activity.target}</b><span>{activity.time}</span></p></div>)}</div></section><div className="team-note"><div className="avatar-stack">{mockUsers.map((user) => <span className="avatar" style={{ backgroundColor: user.avatarColor }} key={user.id}>{user.initials}</span>)}</div><p>Your team has a clear view of the week. Keep the signal high.</p></div></>}</AppShell>;
}
