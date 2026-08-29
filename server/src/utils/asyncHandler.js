/**
 * Wraps async route handlers so thrown errors are forwarded to Express
 * error-handling middleware without needing try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
