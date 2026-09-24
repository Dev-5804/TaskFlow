import { Router } from "express";
import { parseCookie } from "cookie";
import { prisma } from "../config/database.js";
import { requireAuth } from "../middleware/require-auth.js";
import { loginSchema, registerSchema } from "../schemas/auth.js";
import {
  comparePassword,
  createAccessToken,
  createRefreshToken,
  hashPassword,
  hashRefreshToken,
  refreshCookieName,
  refreshCookieClearOptions,
  refreshCookieOptions,
} from "../utils/auth.js";

const router = Router();

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

function validationError(res, result) {
  return res.status(400).json({ message: "Invalid request", issues: result.error.issues });
}

function getRefreshToken(req) {
  return parseCookie(req.headers.cookie || "")[refreshCookieName];
}

async function createSession(userId) {
  const refresh = createRefreshToken();
  await prisma.refreshToken.create({ data: { userId, tokenHash: refresh.tokenHash, expiresAt: refresh.expiresAt } });
  return refresh;
}

router.post("/register", async (req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) return validationError(res, result);

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: result.data.email } });
    if (existingUser) return res.status(409).json({ message: "An account with this email already exists" });

    const passwordHash = await hashPassword(result.data.password);
    const user = await prisma.user.create({ data: { name: result.data.name, email: result.data.email, passwordHash } });
    const refresh = await createSession(user.id);

    res.cookie(refreshCookieName, refresh.token, refreshCookieOptions);
    return res.status(201).json({ user: publicUser(user), accessToken: createAccessToken(user.id) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) return validationError(res, result);

  try {
    const user = await prisma.user.findUnique({ where: { email: result.data.email } });
    const passwordMatches = user ? await comparePassword(result.data.password, user.passwordHash) : false;
    if (!user || !passwordMatches) return res.status(401).json({ message: "Invalid email or password" });

    const refresh = await createSession(user.id);
    res.cookie(refreshCookieName, refresh.token, refreshCookieOptions);
    return res.json({ user: publicUser(user), accessToken: createAccessToken(user.id) });
  } catch (error) {
    return next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  const rawToken = getRefreshToken(req);
  if (!rawToken) return res.status(401).json({ message: "Refresh token required" });

  try {
    const currentToken = await prisma.refreshToken.findUnique({ where: { tokenHash: hashRefreshToken(rawToken) } });
    if (!currentToken || currentToken.revokedAt || currentToken.expiresAt <= new Date()) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const replacement = createRefreshToken();
    await prisma.$transaction([
      prisma.refreshToken.update({ where: { id: currentToken.id }, data: { revokedAt: new Date() } }),
      prisma.refreshToken.create({ data: { userId: currentToken.userId, tokenHash: replacement.tokenHash, expiresAt: replacement.expiresAt } }),
    ]);

    res.cookie(refreshCookieName, replacement.token, refreshCookieOptions);
    return res.json({ accessToken: createAccessToken(currentToken.userId) });
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  const rawToken = getRefreshToken(req);
  try {
    if (rawToken) {
      await prisma.refreshToken.updateMany({ where: { tokenHash: hashRefreshToken(rawToken), revokedAt: null }, data: { revokedAt: new Date() } });
    }
    res.clearCookie(refreshCookieName, refreshCookieClearOptions);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
