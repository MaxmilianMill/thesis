import {} from 'express';
import { AppError } from '../utils/app-error.js';
export const globalErrorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    console.error(`[Error] ${statusCode} - ${message}`, err.stack);
    // Send the formatted response
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // Only send stack trace in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
//# sourceMappingURL=global-error-handler.js.map