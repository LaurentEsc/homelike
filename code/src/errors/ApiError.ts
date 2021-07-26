export interface ApiError extends Error {
  statusCode: number;
  details?: Record<string, unknown>;
}