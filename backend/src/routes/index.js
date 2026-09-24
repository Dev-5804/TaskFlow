import { Router } from "express";
import authRoutes from "./auth.js";
import workspaceRoutes from "./workspaces.js";
import boardRoutes from "./boards.js";
import taskRoutes from "./tasks.js";
import commentRoutes from "./comments.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/boards", boardRoutes);
router.use("/tasks", taskRoutes);
router.use("/comments", commentRoutes);

export default router;
