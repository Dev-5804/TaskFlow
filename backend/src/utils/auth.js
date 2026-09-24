import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const accessTokenLifetime = "15m";
const refreshTokenLifetimeMs = 30 * 24 * 60 * 60 * 1000;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "replace-with-a-long-random-secret") {
    throw new Error("JWT_SECRET must be configured with a secure random value");
  }
  return secret;
}

export function hashRefreshToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function createRefreshToken() {
  const token = randomBytes(48).toString("base64url");
  return {
    token,
    tokenHash: hashRefreshToken(token),
    expiresAt: new Date(Date.now() + refreshTokenLifetimeMs),
  };
}

export function createAccessToken(userId) {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: accessTokenLifetime });
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, getJwtSecret());
  if (!payload || typeof payload === "string" || typeof payload.sub !== "string") {
    throw new Error("Invalid access token payload");
  }
  return { userId: payload.sub };
}

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export const refreshCookieName = "taskflow_refresh_token";
export const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/api/auth",
  maxAge: refreshTokenLifetimeMs,
};

export const refreshCookieClearOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/api/auth",
};
