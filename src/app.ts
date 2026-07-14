import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import importRoutes from './routes/import.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is healthy', data: null });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/documents/import', importRoutes);
app.use(errorHandler);

export default app;
