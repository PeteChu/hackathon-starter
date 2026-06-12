// Reference demo API client — replace with the real challenge's client.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export interface Idea {
  id: number
  title: string
  description: string
  votes: number
  createdAt: string
}

/** Minimal runtime guard: a malformed 2xx body surfaces as an error instead of crashing the render. */
function asIdea(v: unknown): Idea {
  const i = (v && typeof v === "object" ? v : null) as Record<
    string,
    unknown
  > | null
  if (
    !i ||
    typeof i.id !== "number" ||
    typeof i.title !== "string" ||
    typeof i.description !== "string" ||
    typeof i.votes !== "number" ||
    typeof i.createdAt !== "string"
  ) {
    throw new Error("Malformed idea in API response")
  }
  return {
    id: i.id,
    title: i.title,
    description: i.description,
    votes: i.votes,
    createdAt: i.createdAt,
  }
}

export async function getIdeas(): Promise<Idea[]> {
  const res = await fetch(`${API_URL}/api/ideas`, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to load ideas (${res.status})`)
  const data: unknown = await res.json()
  const ideas = (data as { ideas?: unknown } | null)?.ideas
  if (!Array.isArray(ideas)) {
    throw new Error("Unexpected response from ideas API")
  }
  return ideas.map(asIdea)
}

export async function createIdea(input: {
  title: string
  description?: string
}): Promise<Idea> {
  const res = await fetch(`${API_URL}/api/ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null
    throw new Error(body?.error?.message ?? `Create failed (${res.status})`)
  }
  return asIdea(await res.json())
}

export async function voteIdea(id: number): Promise<Idea> {
  const res = await fetch(`${API_URL}/api/ideas/${id}/vote`, {
    method: "POST",
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null
    throw new Error(body?.error?.message ?? `Vote failed (${res.status})`)
  }
  return asIdea(await res.json())
}
