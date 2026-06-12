// Reference demo store — replace with the real challenge's data layer.
// Module-level in-memory store; swap for a DB later by reimplementing these exports.
import type { Idea } from "./ideas.js"

let ideas: Idea[] = []
let nextId = 1

export function listIdeas(): Idea[] {
  return ideas
}

export function addIdea(input: { title: string; description: string }): Idea {
  const idea: Idea = {
    id: nextId++,
    title: input.title,
    description: input.description,
    votes: 0,
    createdAt: new Date().toISOString(),
  }
  ideas.push(idea)
  return idea
}

export function voteIdea(id: number): Idea | undefined {
  const idea = ideas.find((i) => i.id === id)
  if (!idea) return undefined
  idea.votes += 1
  return idea
}

/** Test-only: reset the module-level store so tests stay isolated. */
export function resetStore(): void {
  ideas = []
  nextId = 1
}
