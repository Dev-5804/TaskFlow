import { z } from "zod";

export const workspaceIdSchema = z.object({ workspaceId: z.string().uuid() });
export const memberUserIdSchema = z.object({ workspaceId: z.string().uuid(), memberUserId: z.string().uuid() });

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});
