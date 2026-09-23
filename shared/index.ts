export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  position: number;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  message: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  boardId: string;
  userId: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  revoked: boolean;
  expiresAt: string;
  createdAt: string;
}

export const workspaceRoles: WorkspaceRole[] = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];
export const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
export const taskPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
