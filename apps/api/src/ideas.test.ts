import type { FastifyInstance } from "fastify"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { resetStore } from "./lib/store.js"
import { buildServer } from "./server.js"

describe("idea board API", () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = buildServer()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  // Module-level store → reset between tests so they stay isolated + order-independent.
  afterEach(() => {
    resetStore()
  })

  it("GET /api/ideas — empty list when fresh", async () => {
    const res = await app.inject({ method: "GET", url: "/api/ideas" })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ ideas: [] })
  })

  it("POST /api/ideas — creates with votes:0 and 201", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/ideas",
      headers: { "content-type": "application/json" },
      payload: { title: "AI rubber duck", description: "debug with an LLM" },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body).toMatchObject({
      title: "AI rubber duck",
      description: "debug with an LLM",
      votes: 0,
    })
    expect(body.id).toBeTypeOf("number")
    expect(body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it("POST /api/ideas — 400 + JSON error shape on invalid title", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/ideas",
      headers: { "content-type": "application/json" },
      payload: { title: "x" },
    })
    expect(res.statusCode).toBe(400)
    expect(res.json()).toEqual({
      error: { code: "validation_error", message: expect.any(String) },
    })
  })

  it("GET /api/ideas — returns created ideas sorted by votes desc", async () => {
    await app.inject({
      method: "POST",
      url: "/api/ideas",
      headers: { "content-type": "application/json" },
      payload: { title: "First idea" },
    })
    const second = (
      await app.inject({
        method: "POST",
        url: "/api/ideas",
        headers: { "content-type": "application/json" },
        payload: { title: "Second idea" },
      })
    ).json()
    await app.inject({ method: "POST", url: `/api/ideas/${second.id}/vote` })

    const res = await app.inject({ method: "GET", url: "/api/ideas" })
    const ideas = res.json().ideas
    expect(ideas).toHaveLength(2)
    expect(ideas[0].title).toBe("Second idea")
    expect(ideas[1].title).toBe("First idea")
  })

  it("POST /api/ideas/:id/vote — increments and returns updated idea", async () => {
    const created = (
      await app.inject({
        method: "POST",
        url: "/api/ideas",
        headers: { "content-type": "application/json" },
        payload: { title: "Vote me" },
      })
    ).json()
    const res = await app.inject({
      method: "POST",
      url: `/api/ideas/${created.id}/vote`,
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().votes).toBe(1)
  })

  it("POST /api/ideas/:id/vote — 404 for unknown id", async () => {
    const res = await app.inject({ method: "POST", url: "/api/ideas/9999/vote" })
    expect(res.statusCode).toBe(404)
    expect(res.json()).toEqual({
      error: { code: "not_found", message: "idea not found" },
    })
  })

  it("POST /api/ideas/:id/vote — 404 for non-numeric id", async () => {
    const res = await app.inject({ method: "POST", url: "/api/ideas/abc/vote" })
    expect(res.statusCode).toBe(404)
  })
})
