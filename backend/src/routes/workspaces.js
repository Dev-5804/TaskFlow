import { Router } from "express";
import { prisma } from "../config/database.js";
import { requireAuth } from "../middleware/require-auth.js";
import {
  createWorkspaceSchema,
  inviteMemberSchema,
  memberUserIdSchema,
  updateMemberRoleSchema,
  workspaceIdSchema,
} from "../schemas/workspaces.js";

const router = Router();
router.use(requireAuth);

const workspaceInclude = {
  members: {
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { joinedAt: "asc" },
  },
  boards: { orderBy: { updatedAt: "desc" }, select: { id: true, name: true, description: true, updatedAt: true } },
};

function parseBody(res, schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    res.status(400).json({ message: "Invalid request", issues: result.error.issues });
    return null;
  }
  return result.data;
}

async function getMembership(workspaceId, userId) {
  return prisma.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId, userId } } });
}

async function requireOwner(req, res, workspaceId) {
  const membership = await getMembership(workspaceId, req.userId);
  if (!membership) {
    res.status(404).json({ message: "Workspace not found" });
    return null;
  }
  if (membership.role !== "OWNER") {
    res.status(403).json({ message: "Only the workspace owner can manage members" });
    return null;
  }
  return membership;
}

router.post("/", async (req, res, next) => {
  const data = parseBody(res, createWorkspaceSchema, req.body);
  if (!data) return;

  try {
    const workspace = await prisma.$transaction(async (transaction) => {
      const createdWorkspace = await transaction.workspace.create({ data: { ...data, createdBy: req.userId } });
      await transaction.workspaceMember.create({ data: { workspaceId: createdWorkspace.id, userId: req.userId, role: "OWNER" } });
      return transaction.workspace.findUnique({ where: { id: createdWorkspace.id }, include: workspaceInclude });
    });
    return res.status(201).json({ workspace });
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const workspaces = await prisma.workspace.findMany({ where: { members: { some: { userId: req.userId } } }, include: workspaceInclude, orderBy: { updatedAt: "desc" } });
    return res.json({ workspaces });
  } catch (error) {
    return next(error);
  }
});

router.get("/:workspaceId", async (req, res, next) => {
  const params = parseBody(res, workspaceIdSchema, req.params);
  if (!params) return;

  try {
    const membership = await getMembership(params.workspaceId, req.userId);
    if (!membership) return res.status(404).json({ message: "Workspace not found" });
    const workspace = await prisma.workspace.findUnique({ where: { id: params.workspaceId }, include: workspaceInclude });
    return res.json({ workspace, role: membership.role });
  } catch (error) {
    return next(error);
  }
});

router.post("/:workspaceId/members", async (req, res, next) => {
  const params = parseBody(res, workspaceIdSchema, req.params);
  const data = parseBody(res, inviteMemberSchema, req.body);
  if (!params || !data) return;

  try {
    const owner = await requireOwner(req, res, params.workspaceId);
    if (!owner) return;
    const user = await prisma.user.findUnique({ where: { email: data.email }, select: { id: true, name: true, email: true } });
    if (!user) return res.status(404).json({ message: "A registered user with this email was not found" });
    const existingMember = await getMembership(params.workspaceId, user.id);
    if (existingMember) return res.status(409).json({ message: "User is already a workspace member" });
    const member = await prisma.workspaceMember.create({ data: { workspaceId: params.workspaceId, userId: user.id, role: data.role }, include: { user: { select: { id: true, name: true, email: true } } } });
    return res.status(201).json({ member });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:workspaceId/members/:memberUserId", async (req, res, next) => {
  const params = parseBody(res, memberUserIdSchema, req.params);
  const data = parseBody(res, updateMemberRoleSchema, req.body);
  if (!params || !data) return;

  try {
    const owner = await requireOwner(req, res, params.workspaceId);
    if (!owner) return;
    const member = await getMembership(params.workspaceId, params.memberUserId);
    if (!member) return res.status(404).json({ message: "Workspace member not found" });
    if (member.role === "OWNER") return res.status(409).json({ message: "The owner role cannot be changed" });
    const updatedMember = await prisma.workspaceMember.update({ where: { id: member.id }, data: { role: data.role }, include: { user: { select: { id: true, name: true, email: true } } } });
    return res.json({ member: updatedMember });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:workspaceId/members/me", async (req, res, next) => {
  const params = parseBody(res, workspaceIdSchema, req.params);
  if (!params) return;

  try {
    const member = await getMembership(params.workspaceId, req.userId);
    if (!member) return res.status(404).json({ message: "Workspace not found" });
    if (member.role === "OWNER") return res.status(409).json({ message: "Transfer ownership before leaving this workspace" });
    await prisma.workspaceMember.delete({ where: { id: member.id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.delete("/:workspaceId/members/:memberUserId", async (req, res, next) => {
  const params = parseBody(res, memberUserIdSchema, req.params);
  if (!params) return;

  try {
    const owner = await requireOwner(req, res, params.workspaceId);
    if (!owner) return;
    const member = await getMembership(params.workspaceId, params.memberUserId);
    if (!member) return res.status(404).json({ message: "Workspace member not found" });
    if (member.role === "OWNER") return res.status(409).json({ message: "The owner cannot be removed" });
    await prisma.workspaceMember.delete({ where: { id: member.id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
