"use client"

import { ArrowUp } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import { useCallback, useEffect, useState, type FormEvent } from "react"
import { createIdea, getIdeas, voteIdea, type Idea } from "@/lib/api"

export default function Page() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setIdeas(await getIdeas())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ideas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await createIdea({
        title: title.trim(),
        description: desc.trim() || undefined,
      })
      setTitle("")
      setDesc("")
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to post idea")
    } finally {
      setSubmitting(false)
    }
  }

  const onVote = async (id: number) => {
    try {
      const updated = await voteIdea(id)
      setIdeas((prev) =>
        [...prev.map((i) => (i.id === id ? updated : i))].sort((a, b) =>
          b.votes === a.votes
            ? a.createdAt.localeCompare(b.createdAt)
            : b.votes - a.votes,
        ),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to vote")
    }
  }

  const totalVotes = ideas.reduce((sum, i) => sum + i.votes, 0)
  const top = ideas[0]

  return (
    <main className="mx-auto min-h-svh w-full max-w-2xl p-6">
      <header className="mb-6">
        <h1 className="text-lg font-medium">Hackathon Idea Board</h1>
        <p className="text-xs text-muted-foreground">
          Post an idea, upvote the best ones. Live leaderboard.
        </p>
      </header>

      {/* Proof metric */}
      <section className="mb-6 grid grid-cols-3 gap-2 border border-border text-center text-xs">
        <div className="p-2">
          <div className="text-base font-medium">{ideas.length}</div>
          <div className="text-muted-foreground">ideas</div>
        </div>
        <div className="p-2">
          <div className="text-base font-medium">{totalVotes}</div>
          <div className="text-muted-foreground">votes</div>
        </div>
        <div className="p-2">
          <div className="truncate text-base font-medium">
            {top ? top.title : "—"}
          </div>
          <div className="text-muted-foreground">top idea</div>
        </div>
      </section>

      {/* Submit form */}
      <form onSubmit={onSubmit} className="mb-6 flex flex-col gap-2">
        <input
          className="h-9 border border-border bg-background px-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
          aria-label="Idea title"
          placeholder="Idea title (3–140 chars)"
          value={title}
          minLength={3}
          maxLength={140}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="min-h-16 border border-border bg-background p-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
          aria-label="Idea description (optional)"
          placeholder="Optional description (max 1000)"
          value={desc}
          maxLength={1000}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Posting…" : "Post idea"}
        </Button>
      </form>

      {/* Error state */}
      {error && (
        <div className="mb-4 border border-destructive/40 p-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Loading / empty / success states */}
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : ideas.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No ideas yet — be the first.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ideas.map((i) => (
            <li
              key={i.id}
              className="flex items-start gap-3 border border-border p-3"
            >
              <button
                type="button"
                onClick={() => onVote(i.id)}
                className="flex flex-col items-center pt-0.5"
                aria-label={`Upvote ${i.title}`}
              >
                <ArrowUp className="size-4" weight="bold" />
                <span className="text-xs font-medium">{i.votes}</span>
              </button>
              <div className="min-w-0">
                <div className="text-sm font-medium">{i.title}</div>
                {i.description && (
                  <div className="text-xs text-muted-foreground">
                    {i.description}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
