import cors from '@fastify/cors';
import Fastify from 'fastify';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';

const createIdeaSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().default(''),
  score: z.number().int().min(0).max(10).default(5),
});

type Idea = {
  id: number;
  title: string;
  description: string;
  score: number;
  createdAt: string;
};

export function buildServer() {
  const app = Fastify({ logger: true });
  const now = new Date().toISOString();
  let nextId = 3;
  const ideas: Idea[] = [
    { id: 1, title: 'Frame the user pain', description: 'Make the demo obvious to judges in ten seconds.', score: 9, createdAt: now },
    { id: 2, title: 'Ship one vertical slice', description: 'Connect UI, API, and proof metric before adding features.', score: 10, createdAt: now },
  ];

  app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  });

  app.get('/healthz', async () => ({ ok: true, service: 'api-node' }));

  app.get('/api/config', async () => ({ apiBase: '/api' }));

  app.get('/api/ideas', async () => ({ ideas }));

  app.post('/api/ideas', async (request, reply) => {
    const parsed = createIdeaSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: {
          code: 'validation_error',
          message: parsed.error.issues.map((issue) => issue.message).join('; '),
        },
      });
    }

    const item: Idea = {
      id: nextId++,
      ...parsed.data,
      createdAt: new Date().toISOString(),
    };
    ideas.unshift(item);
    return reply.code(201).send(item);
  });

  return app;
}

async function main() {
  const app = buildServer();
  const port = Number(process.env.PORT ?? 8080);
  await app.listen({ port, host: '0.0.0.0' });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

