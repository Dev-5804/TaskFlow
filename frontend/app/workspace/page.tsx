"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/feedback/LoadingState";
import { useAuth } from "@/components/auth/AuthProvider";
import type { WorkspaceRole, WorkspaceSummary } from "@/types/workspace";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function readResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Workspace request failed");
  return data;
}

export default function WorkspacePage() {
  const { accessToken, status, user } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [selected, setSelected] = useState<WorkspaceSummary | null>(null);
  const [role, setRole] = useState<WorkspaceRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Exclude<WorkspaceRole, "OWNER">>("MEMBER");
  const [isSaving, setIsSaving] = useState(false);

  const request = useCallback(async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}`, ...options.headers },
    });
    return readResponse(response);
  }, [accessToken]);

  useEffect(() => {
    if (status !== "authenticated" || !accessToken) return;
    async function loadWorkspaces() {
      setIsLoading(true);
      setError("");
      try {
        const data = await request("/api/workspaces");
        setWorkspaces(data.workspaces);
        if (data.workspaces.length > 0) {
          const workspaceData = await request(`/api/workspaces/${data.workspaces[0].id}`);
          setSelected(workspaceData.workspace);
          setRole(workspaceData.role);
        } else {
          setSelected(null);
          setRole(null);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load workspaces");
      } finally {
        setIsLoading(false);
      }
    }
    void loadWorkspaces();
  }, [accessToken, request, status]);

  async function createWorkspace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const data = await request("/api/workspaces", { method: "POST", body: JSON.stringify({ name, description }) });
      setSelected(data.workspace);
      setRole("OWNER");
      setWorkspaces((current) => [data.workspace, ...current]);
      setName("");
      setDescription("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to create workspace");
    } finally {
      setIsSaving(false);
    }
  }

  async function inviteMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setIsSaving(true);
    setError("");
    try {
      const data = await request(`/api/workspaces/${selected.id}/members`, { method: "POST", body: JSON.stringify({ email: inviteEmail, role: inviteRole }) });
      setSelected((current) => current ? { ...current, members: [...current.members, data.member] } : current);
      setInviteEmail("");
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Unable to invite member");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateMember(memberUserId: string, memberRole: Exclude<WorkspaceRole, "OWNER">) {
    if (!selected) return;
    try {
      const data = await request(`/api/workspaces/${selected.id}/members/${memberUserId}`, { method: "PATCH", body: JSON.stringify({ role: memberRole }) });
      setSelected((current) => current ? { ...current, members: current.members.map((member) => member.user.id === memberUserId ? data.member : member) } : current);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update member");
    }
  }

  async function removeMember(memberUserId: string) {
    if (!selected) return;
    try {
      await request(`/api/workspaces/${selected.id}/members/${memberUserId}`, { method: "DELETE" });
      setSelected((current) => current ? { ...current, members: current.members.filter((member) => member.user.id !== memberUserId) } : current);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove member");
    }
  }

  async function leaveWorkspace() {
    if (!selected) return;
    try {
      await request(`/api/workspaces/${selected.id}/members/me`, { method: "DELETE" });
      setWorkspaces((current) => current.filter((workspace) => workspace.id !== selected.id));
      setSelected(null);
      setRole(null);
    } catch (leaveError) {
      setError(leaveError instanceof Error ? leaveError.message : "Unable to leave workspace");
    }
  }

  if (isLoading) return <AppShell><LoadingState label="Loading your workspaces" /></AppShell>;

  if (!selected) return <AppShell><div className="page-header page-header--compact"><div><span className="eyebrow">Your first shared space</span><h1>Create a workspace.</h1><p>Give your team one place for boards, decisions, and momentum.</p></div><Link className="button button--secondary" href="/dashboard">Back to overview</Link></div><form className="workspace-create-panel" onSubmit={createWorkspace}><label htmlFor="workspace-name">Workspace name</label><input id="workspace-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Studio 11" required /><label htmlFor="workspace-description">Description</label><textarea id="workspace-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this team building?" rows={4} /><button className="button button--primary" disabled={isSaving}>{isSaving ? "Creating..." : "Create workspace"}</button>{error && <p className="form-error" role="alert">{error}</p>}</form></AppShell>;

  const isOwner = role === "OWNER";
  return <AppShell><div className="page-header page-header--compact"><div><span className="eyebrow">Workspace overview</span><h1>{selected.name}</h1><p>{selected.description || "A shared space for focused team work."}</p></div><Link className="button button--secondary" href="/dashboard">Back to overview</Link></div>{error && <p className="form-error workspace-alert" role="alert">{error}</p>}<section className="workspace-hero"><div><span className="eyebrow">The room behind the work</span><h2>{selected.members.length} people, one clear direction.</h2><p>Keep boards close, decisions visible, and the next action easy to find.</p></div><div className="workspace-hero__stat"><strong>{selected.boards.length}</strong><span>active boards</span></div></section><section className="workspace-grid"><div className="workspace-panel"><div className="section-heading"><div><span className="eyebrow">Shared spaces</span><h2>Boards</h2></div></div>{selected.boards.length === 0 ? <p className="empty-inline">Boards will appear here when Phase 6 CRUD is connected.</p> : selected.boards.map((board) => <Link className="workspace-board" href={`/boards/${board.id}`} key={board.id}><span className="board-card__swatch" /><span><strong>{board.name}</strong><small>{board.updatedAt}</small></span><span className="arrow">↗</span></Link>)}</div><div className="workspace-panel"><div className="section-heading"><div><span className="eyebrow">The people</span><h2>Members</h2></div><span className="section-heading__count">{role}</span></div><div className="member-list">{selected.members.map((member) => <div className="member-item" key={member.id}><span className="avatar" style={{ backgroundColor: member.user.id === user?.id ? "#e5a84b" : "#5c8d89" }}>{member.user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span><strong>{member.user.name}</strong><small>{member.user.email}</small></span>{isOwner && member.role !== "OWNER" ? <><select className="role-select" aria-label={`Role for ${member.user.name}`} value={member.role} onChange={(event) => void updateMember(member.user.id, event.target.value as Exclude<WorkspaceRole, "OWNER">)}><option value="ADMIN">Admin</option><option value="MEMBER">Member</option><option value="VIEWER">Viewer</option></select><button className="text-button" onClick={() => void removeMember(member.user.id)}>Remove</button></> : <span className="member-role">{member.role}</span>}</div>)}</div>{isOwner && <form className="invite-form" onSubmit={inviteMember}><label htmlFor="invite-email">Invite a registered teammate</label><div className="invite-form__row"><input id="invite-email" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="teammate@studio.com" required /><select value={inviteRole} onChange={(event) => setInviteRole(event.target.value as Exclude<WorkspaceRole, "OWNER">)} aria-label="Invitation role"><option value="MEMBER">Member</option><option value="ADMIN">Admin</option><option value="VIEWER">Viewer</option></select><button className="button button--primary" disabled={isSaving}>Invite</button></div></form>}{!isOwner && <button className="button button--ghost leave-button" onClick={() => void leaveWorkspace()}>Leave workspace</button>}</div></section></AppShell>;
}
