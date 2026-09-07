export class TimeoutError extends Error {
  readonly code = "BACKEND_TIMEOUT" as const;

  constructor(message = "Request timed out. The backend may be waking up.") {
    super(message);
    this.name = "TimeoutError";
  }
}

export function isTimeoutError(err: unknown): err is TimeoutError {
  return err instanceof TimeoutError;
}
