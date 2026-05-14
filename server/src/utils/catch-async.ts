import type { NextFunction, Request, Response } from "express";
import { log } from "../services/logger/activity-logger-service.js";
import type { AuthRequest } from "../middlewares/auth-handler.js";

export const catchAsync = (fn: Function) => {

  return (req: Request | AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      log({
        action: `${fn.name}_failed`,
        status: "error",
        uid: ("authToken" in req) ? req.authToken.uid : "no_uid",
        message: `Body: ${JSON.stringify(req.body)} | Params: ${JSON.stringify(req.params)}`
      });
      
      next(error);
    });
  };
};