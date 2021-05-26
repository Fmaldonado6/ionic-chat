export class AppError {
    constructor(public originalError?: any) { }
}

export class BadInput extends AppError { }

export class Conflict extends AppError { }

export class NotFoundError extends AppError { }


export class Forbidden extends AppError { }
