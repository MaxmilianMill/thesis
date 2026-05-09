import type { NextFunction, Request, Response } from "express";
import { log } from "../services/logger/activity-logger-service.js";
import type { AuthRequest } from "../middlewares/auth-handler.js";

export const catchAsync = (fn: Function) => {

  return (req: Request, res: Response, next: NextFunction) => {
    log({
      action: `${fn.name}_failed`,
      status: "error",
      uid: (req as AuthRequest)?.authToken.uid ?? "",
      message: `func args: ${String(fn.arguments)}`
    });

    Promise.resolve(fn(req, res, next)).catch(next);
  };
};