import cors from "@fastify/cors"
import Fastify from "fastify"
import { pathToFileURL } from "node:url"
import * as z from "zod"
import { CreateIdea } from "./lib/ideas.js"
import { addIdea, listIdeas, voteIdea } from "./lib/store.js"

export function buildServer() {
  const app = Fastify({ logger: true })

  app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  })

  app.get("/healthz", async () => ({ ok: true, service: "api-node" }))

  // --- Reference demo: idea board (replace with the real challenge) ---

  // GET /api/ideas — sorted by votes desc, then createdAt asc (earlier wins ties)
  app.get("/api/ideas", async () => {
    const all = [...listIdeas()].sort((a, b) =>
      b.votes === a.votes
        ? a.createdAt.localeCompare(b.createdAt)
        : b.votes - a.votes
    )
    return { ideas: all }
  })

  // POST /api/ideas
  app.post("/api/ideas", async (request, reply) => {
    const result = z.safeParse(CreateIdea, request.body ?? {})
    if (!result.success) {
      return reply.code(400).send({
        error: {
          code: "validation_error",
          message: result.error.issues.map((i) => i.message).join("; "),
        },
      })
    }
    const idea = addIdea(result.data)
    return reply.code(201).send(idea)
  })

  // POST /api/ideas/:id/vote
  app.post<{ Params: { id: string } }>(
    "/api/ideas/:id/vote",
    async (request, reply) => {
      const id = Number(request.params.id)
      if (!Number.isInteger(id) || id < 1) {
        return reply
          .code(404)
          .send({ error: { code: "not_found", message: "idea not found" } })
      }
      const idea = voteIdea(id)
      if (!idea) {
        return reply
          .code(404)
          .send({ error: { code: "not_found", message: "idea not found" } })
      }
      return reply.code(200).send(idea)
    }
  )

  return app
}

async function main() {
  const app = buildServer()
  const port = Number(process.env.PORT ?? 8080)
  await app.listen({ port, host: "0.0.0.0" })
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
