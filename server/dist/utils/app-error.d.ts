export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class BadRequestError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=app-error.d.ts.map