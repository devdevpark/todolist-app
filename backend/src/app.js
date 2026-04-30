import './config/env.js';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/error-handler.js';
import authRouter from './routes/auth-routes.js';
import todoRouter from './routes/todo-routes.js';
import categoryRouter from './routes/category-routes.js';
import adminRouter from './routes/admin-routes.js';

const app = express();

console.log('[App] Initializing Express application...');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../swagger/swagger.json'), 'utf8')
);
console.log('[App] Swagger documentation loaded.');

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(requestLogger);
console.log('[App] Global middlewares registered.');

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRouter);
app.use('/api/todos', todoRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/admin', adminRouter);
console.log('[App] API routes registered (/auth, /todos, /categories, /admin).');

app.use(errorHandler);
console.log('[App] Error handler registered.');

export default app;
