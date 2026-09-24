import { Router } from "express";

const router = Router();

router.all("*", (req, res) => {
  res.status(501).json({ message: "Workspace routes will be implemented in Phase 5." });
});

export default router;
