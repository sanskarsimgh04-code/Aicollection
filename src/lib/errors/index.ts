/**
 * Centralized Error Hierarchy for A1 Collection
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, true, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', id?: string) {
    const message = id ? `${resource} with id '${id}' was not found` : `${resource} was not found`;
    super(message, 'NOT_FOUND', 404, true);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required or insufficient permissions') {
    super(message, 'UNAUTHORIZED', 401, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden to this resource') {
    super(message, 'FORBIDDEN', 403, true);
  }
}

export class PaymentConfigError extends AppError {
  constructor(
    message: string = 'Payment method requested is not active under current store configuration'
  ) {
    super(message, 'PAYMENT_CONFIG_ERROR', 400, true);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests. Please slow down.') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, true);
  }
}

export class SupabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'SUPABASE_ERROR', 502, true, details);
  }
}

/**
 * Standard API error format returned across server-actions and API routes
 */
export interface SerializedError {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: unknown;
  };
}

export function formatErrorResponse(error: unknown): SerializedError {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
      },
    };
  }

  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return {
    success: false,
    error: {
      message,
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
    },
  };
}
