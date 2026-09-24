import { verifyAccessToken } from "../utils/auth.js";

export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const { userId } = verifyAccessToken(token);
    req.userId = userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}
