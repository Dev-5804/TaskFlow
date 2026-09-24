import { Router } from "express";

const router = Router();

router.all("*", (req, res) => {
  res.status(501).json({ message: "Comment routes will be implemented in Phase 10." });
});

export default router;
