import { Router } from "express";

const router = Router();

router.all("*", (req, res) => {
  res.status(501).json({ message: "Auth routes will be implemented in Phase 4." });
});

export default router;
