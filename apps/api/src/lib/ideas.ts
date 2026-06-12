// Reference demo domain — replace with the real challenge's domain.
import * as z from "zod"

export interface Idea {
  id: number
  title: string
  description: string
  votes: number
  createdAt: string
}

export const CreateIdea = z.object({
  title: z.string().min(3).max(140),
  description: z.string().max(1000).optional().default(""),
})

export type CreateIdeaInput = z.infer<typeof CreateIdea>
