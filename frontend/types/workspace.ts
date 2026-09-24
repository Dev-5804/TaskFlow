export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type WorkspaceMember = {
  id: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type WorkspaceSummary = {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  members: WorkspaceMember[];
  boards: { id: string; name: string; description: string | null; updatedAt: string }[];
};
