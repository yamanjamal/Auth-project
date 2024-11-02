export default class InvalidateRefreshTokenError extends Error {
  public static bearerIsRequired = (message?: string) => ({
    errorCode: 1010,
    message: message ? message : "Authentication type 'Bearer' is required!",
  });
}
