import { NextFunction, Request, Response } from "express";

import { authService, HttpError } from "../services/auth.service.js";

const requireString = (
  value: unknown,
  fieldName: string,
  minLength = 1
): string => {
  if (typeof value !== "string" || value.trim().length < minLength) {
    throw new HttpError(400, `${fieldName} is invalid`);
  }

  return value.trim();
};

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const fullName = requireString(req.body.fullName, "fullName", 2);
      const email = requireString(req.body.email, "email", 5);
      const password = requireString(req.body.password, "password", 6);

      const result = await authService.register(fullName, email, password);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const email = requireString(req.body.email, "email", 5);
      const password = requireString(req.body.password, "password", 6);

      const result = await authService.login(email, password);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const email = requireString(req.body.email, "email", 5);
      const result = await authService.forgotPassword(email);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const token = requireString(req.body.token, "token", 10);
      const newPassword = requireString(req.body.newPassword, "newPassword", 6);
      const result = await authService.resetPassword(token, newPassword);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};
