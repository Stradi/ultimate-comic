class BaseError {
  readonly type: string;
  readonly message: string;
  readonly explanation: string;
  readonly action: string;

  constructor(
    type: string,
    message: string,
    explanation: string,
    action: string
  ) {
    this.type = type;
    this.message = message;
    this.explanation = explanation;
    this.action = action;
  }
}

class DatabaseError extends BaseError {
  constructor(message: string, explanation: string, action: string) {
    super('db', message, explanation, action);
  }
}

class ApiError extends BaseError {
  readonly status: number;
  constructor(
    status: number,
    message: string,
    explanation: string,
    action: string
  ) {
    super('api', message, explanation, action);
    this.status = status;
  }
}

export { BaseError, DatabaseError, ApiError };
