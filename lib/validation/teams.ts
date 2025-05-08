import * as z from "zod"

export const teamSchema = z.object({
    name: z.string()
        .min(3, "Team name must be at least 3 characters")
        .max(50, "Team name must be less than 50 characters"),
    description: z.string()
        .max(300, "Description must be less than 300 characters")
})

export type TeamFormValues = z.infer<typeof teamSchema>