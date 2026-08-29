import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import errorHandler from './middleware/errorHandler.js';

// ── Route imports ────────────────────────────────────────────
import authRoutes from './routes/auth.js';

const app = express();

// ── Global middleware ────────────────────────────────────────
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AI-IGMS API is running 🚀',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── 404 catch-all ────────────────────────────────────────────
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ── Error handler (must be last) ─────────────────────────────
app.use(errorHandler);

export default app;
