/**
 * Server Action and API Response Types
 */

export interface ActionSuccess<T> {
  success: true;
  data: T;
  error?: never;
}

export interface ActionFailure {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode?: number;
    details?: unknown;
  };
  data?: never;
}

export type ActionResponse<T> = ActionSuccess<T> | ActionFailure;
