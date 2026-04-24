import { NextFunction, Request, Response } from "express";

import { shortUrlService } from "../services/short-url.service.js";
import { HttpError } from "../services/auth.service.js";

const requireString = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} is invalid`);
  }

  return value.trim();
};

const buildShortUrl = (req: Request, code: string): string =>
  `${req.protocol}://${req.get("host")}/u/${code}`;

const toResponse = (req: Request, shortUrl: Awaited<ReturnType<typeof shortUrlService.findByCode>>) => {
  if (!shortUrl) {
    return null;
  }

  return {
    ...shortUrl,
    shortUrl: buildShortUrl(req, shortUrl.code)
  };
};

export const shortUrlController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const shortUrls = await shortUrlService.list();

      res.json({
        data: shortUrls.map((shortUrl) => toResponse(req, shortUrl))
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const originalUrl = requireString(req.body.originalUrl, "originalUrl");
      const customCode = typeof req.body.customCode === "string" ? req.body.customCode : undefined;
      const shortUrl = await shortUrlService.create(originalUrl, customCode);

      res.status(201).json(toResponse(req, shortUrl));
    } catch (error) {
      next(error);
    }
  },

  async redirect(req: Request, res: Response, next: NextFunction) {
    try {
      const code = requireString(req.params.code, "code");
      const shortUrl = await shortUrlService.findByCode(code);

      if (!shortUrl) {
        throw new HttpError(404, "Không tìm thấy short URL");
      }

      await shortUrlService.recordVisit(shortUrl.id, {
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        referrer: req.get("referer")
      });

      res.redirect(302, shortUrl.originalUrl);
    } catch (error) {
      next(error);
    }
  }
};
