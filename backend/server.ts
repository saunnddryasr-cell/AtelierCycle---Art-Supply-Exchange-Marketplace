import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export async function createBackendApp() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API logging
  app.use('/api', (req, res, next) => {
    console.log(`[Backend API] ${req.method} ${req.url}`);
    next();
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Frontend integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(rootDir, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(rootDir, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      root: rootDir,
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  return { app, PORT };
}

export async function startServer() {
  const { app, PORT } = await createBackendApp();
  return app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AtelierCycle Server] Full-stack backend active on http://0.0.0.0:${PORT}`);
  });
}

// Auto-run if executed directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  startServer().catch((err) => {
    console.error('Failed to start backend server:', err);
    process.exit(1);
  });
}
