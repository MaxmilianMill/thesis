export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Flag to identify predictable, handled errors
        // Captures the stack trace, excluding the constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}
// Optional: Create specific sub-classes for convenience
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
export class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}
//# sourceMappingURL=app-error.js.map