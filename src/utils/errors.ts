export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404)
    }
};

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400)
    }
};

export class DatabaseError extends AppError {
    constructor(message: string) {
        super(message, 500)
    }
};