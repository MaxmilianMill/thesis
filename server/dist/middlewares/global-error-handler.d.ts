import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
export declare const globalErrorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=global-error-handler.d.ts.map