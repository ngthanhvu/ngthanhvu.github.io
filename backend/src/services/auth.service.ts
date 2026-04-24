import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { mailService } from "./mail.service.js";
import { passwordResetService } from "./password-reset.service.js";
import { userService } from "./user.service.js";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const signToken = (user: User): string =>
  jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
  });

const sanitizeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const authService = {
  async register(fullName: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await userService.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new HttpError(409, "Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
    const user = await userService.create({
      email: normalizedEmail,
      fullName: fullName.trim(),
      passwordHash
    });

    return {
      token: signToken(user),
      user: sanitizeUser(user)
    };
  },

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await userService.findByEmail(normalizedEmail);

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new HttpError(401, "Invalid email or password");
    }

    return {
      token: signToken(user),
      user: sanitizeUser(user)
    };
  },

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await userService.findByEmail(normalizedEmail);

    if (!user) {
      return {
        message: "If the email exists, a reset link has been sent"
      };
    }

    const { token, expiresAt } = await passwordResetService.create(user.id);
    const resetLink = `${env.clientUrl.replace(/\/$/, "")}/reset-password?token=${token}`;

    await mailService.sendPasswordResetEmail(user.email, resetLink);

    return {
      message: "If the email exists, a reset link has been sent",
      expiresAt
    };
  },

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await passwordResetService.consume(token);

    if (!resetToken) {
      throw new HttpError(400, "Reset token is invalid or expired");
    }

    const passwordHash = await bcrypt.hash(newPassword, env.bcryptSaltRounds);
    await userService.updatePassword(resetToken.userId, passwordHash);

    return {
      message: "Password reset successfully"
    };
  }
};
