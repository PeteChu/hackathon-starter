import { test, expect, type Page } from "@playwright/test"

// ── helpers ──────────────────────────────────────────────────────────────────

let _idCounter = Date.now()
function seedIdea(overrides: Partial<{
  id: number
  title: string
  description: string
  votes: number
  createdAt: string
}> = {}) {
  const id = ++_idCounter
  return {
    id,
    title: `Idea ${id}`,
    description: `Description for ${id}`,
    votes: 0,
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Unified route handler for /api/ideas.
 * Dispatches on method so one registration doesn't override another.
 */
async function mockIdeas(
  page: Page,
  handlers: {
    get?: () => { ideas: unknown[] }
    post?: (body: { title: string; description?: string }) => { status: number; json: unknown }
  },
) {
  await page.route("**/api/ideas", async (route) => {
    const method = route.request().method()
    if (method === "GET" && handlers.get) {
      await route.fulfill({ status: 200, json: handlers.get() })
    } else if (method === "POST" && handlers.post) {
      const body = JSON.parse(route.request().postData() ?? "{}") as {
        title: string
        description?: string
      }
      const { status, json } = handlers.post(body)
      await route.fulfill({ status, json })
    } else {
      await route.continue()
    }
  })
}

/** Intercept POST /api/ideas/:id/vote and return the updated idea. */
async function mockVoteIdea(
  page: Page,
  getUpdated: (id: number) => Record<string, unknown>,
) {
  await page.route("**/api/ideas/*/vote", async (route) => {
    const segments = route.request().url().split("/")
    const id = Number(segments[segments.length - 2])
    await route.fulfill({ status: 200, json: getUpdated(id) })
  })
}

// ── tests ────────────────────────────────────────────────────────────────────

test.describe("Idea Board", () => {
  test("shows empty state when no ideas exist", async ({ page }) => {
    await mockIdeas(page, { get: () => ({ ideas: [] }) })
    await page.goto("/")

    // Proof metric shows zeros (ideas + votes = two "0"s)
    const metric = page.locator("section").first()
    await expect(metric.getByText("0", { exact: true })).toHaveCount(2)
    await expect(metric.getByText("—", { exact: true })).toBeVisible()

    // Empty message
    await expect(
      page.getByText("No ideas yet — be the first."),
    ).toBeVisible()
  })

  test("displays ideas loaded from API", async ({ page }) => {
    const idea = seedIdea()
    await mockIdeas(page, { get: () => ({ ideas: [idea] }) })
    await page.goto("/")

    // The idea appears in the list (use exact matching to avoid substring hits)
    const listItem = page.locator("main ul > li").first()
    await expect(listItem.getByText(idea.title, { exact: true })).toBeVisible()
    await expect(
      listItem.getByText(idea.description, { exact: true }),
    ).toBeVisible()

    // Vote count on the upvote button
    const voteSpan = listItem.locator("span.text-xs.font-medium")
    await expect(voteSpan).toHaveText("0")

    // Proof metric shows 1 idea, 0 votes
    const metric = page.locator("section").first()
    await expect(metric.getByText("1", { exact: true })).toBeVisible()
    await expect(metric.getByText("0", { exact: true })).toBeVisible()
  })

  test("creates a new idea via the form", async ({ page }) => {
    let ideas: unknown[] = []

    await mockIdeas(page, {
      get: () => ({ ideas }),
      post: (body) => {
        const created = seedIdea({
          title: body.title,
          description: body.description ?? "",
          votes: 0,
        })
        ideas = [created]
        return { status: 201, json: created }
      },
    })

    await page.goto("/")
    await expect(page.getByText("No ideas yet")).toBeVisible()

    // Fill and submit the form
    await page.getByLabel("Idea title").fill("My awesome idea")
    await page
      .getByLabel("Idea description (optional)")
      .fill("Description for my awesome idea")
    await page.getByRole("button", { name: "Post idea" }).click()

    // Wait for the new idea to appear in the list (exact match to avoid description substring)
    const listItem = page.locator("main ul > li").first()
    await expect(
      listItem.getByText("My awesome idea", { exact: true }),
    ).toBeVisible()
    await expect(
      listItem.getByText("Description for my awesome idea", { exact: true }),
    ).toBeVisible()

    // Form should be reset
    await expect(page.getByLabel("Idea title")).toHaveValue("")
    await expect(page.getByLabel("Idea description (optional)")).toHaveValue(
      "",
    )
  })

  test("shows error on create failure", async ({ page }) => {
    // Use a valid-length title that will pass HTML5 minLength validation
    // but will be rejected by the API
    await mockIdeas(page, {
      get: () => ({ ideas: [] }),
      post: () => ({
        status: 400,
        json: { error: { message: "Title too short" } },
      }),
    })

    await page.goto("/")
    // Fill a title that passes HTML5 validation (>= 3 chars)
    await page.getByLabel("Idea title").fill("ABC")
    await page.getByRole("button", { name: "Post idea" }).click()

    // Error banner appears
    await expect(page.getByText("Title too short")).toBeVisible()
  })

  test("upvotes an idea and updates the leaderboard", async ({ page }) => {
    const idea = seedIdea()
    let currentVotes = idea.votes

    await mockIdeas(page, { get: () => ({ ideas: [idea] }) })
    await mockVoteIdea(page, () => {
      currentVotes++
      return { ...idea, votes: currentVotes }
    })

    await page.goto("/")

    const listItem = page.locator("main ul > li").first()
    const voteSpan = listItem.locator("span.text-xs.font-medium")
    await expect(voteSpan).toHaveText("0")

    // Click the upvote button
    const upvoteBtn = listItem.getByLabel(`Upvote ${idea.title}`)
    await upvoteBtn.click()

    // Wait for the vote count to update
    await expect(voteSpan).toHaveText("1")
  })

  test("displays ideas in API-returned order (no client-side sort)", async ({
    page,
  }) => {
    const ideas = [
      seedIdea({ votes: 5, title: "Second" }),
      seedIdea({ votes: 10, title: "First" }),
      seedIdea({ votes: 1, title: "Third" }),
    ]

    await mockIdeas(page, { get: () => ({ ideas }) })
    await page.goto("/")

    const items = page.locator("main ul > li")
    await expect(items).toHaveCount(3)

    // Order matches API response order (app does NOT sort on initial load)
    await expect(items.nth(0)).toContainText("Second")
    await expect(items.nth(1)).toContainText("First")
    await expect(items.nth(2)).toContainText("Third")
  })

  test("shows loading state then renders", async ({ page }) => {
    await page.route("**/api/ideas", async (route) => {
      await new Promise((r) => setTimeout(r, 500))
      await route.fulfill({ status: 200, json: { ideas: [] } })
    })

    await page.goto("/")
    await expect(page.getByText("Loading…")).toBeVisible()
    await expect(page.getByText("No ideas yet")).toBeVisible({ timeout: 5000 })
  })

  test("shows error banner when getIdeas fails", async ({ page }) => {
    await page.route("**/api/ideas", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({ status: 500, body: "Server error" })
      }
    })

    await page.goto("/")
    await expect(page.getByText("Failed to load ideas")).toBeVisible()
  })
})
