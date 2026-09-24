import { Router } from "express";

const router = Router();

router.all("*", (req, res) => {
  res.status(501).json({ message: "Board routes will be implemented in Phase 6." });
});

export default router;
