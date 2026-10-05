export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const statusCode = err.code === 11000 ? 409 : err.statusCode || err.status || 500;
  const message = err.code === 11000 ? 'User already exists'
    : err.type === 'entity.parse.failed' ? 'Invalid JSON body.'
    : statusCode >= 500 && !(err instanceof ApiError) ? 'Internal server error'
    : err.message || 'Request failed';
  if (process.env.NODE_ENV !== 'test') console.error(`[error] ${req.method} ${req.path}: ${err.message}`);
  res.status(statusCode).json({ success: false, message });
};

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
