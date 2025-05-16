import { z } from "zod";
export const signUpSchema = z.object({
	name: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(6),
	username: z.string().min(3).max(20),
});

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const newProjectSchema = z.object({
	name: z.string().min(1),
	description: z.string(),
	slug: z.string(),
	isPublic: z.boolean().default(false),
	status: z.enum(["OPEN", "ONGOING", "COMPLETED"]).default("OPEN"),
	dueDate: z.date(),
	ownerId: z.string(),
	
	// attachments: z.array(z.string()).optional(),
	// teamId: z.string().optional(),
});

export const updateProjectSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	description: z
		.string()
		.max(300, "Description must be less than 300 characters"),
});

export const newTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    dueDate: z.date(),
    startDate: z.date().optional(),
    completedAt: z.date().optional(),
    projectId: z.string(),
    assigneeId: z.string().optional(),
	parentId: z.string().optional(),
	status: z.enum(['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'DONE', 'TODO']).default('TODO'),
});

export const teamSchema = z.object({
	name: z.string().min(1),
	description: z.string(),
	// image: z.string().url().optional(),
	// ownerId: z.string().min(1),
	// lead: z.string().optional(),
});

export const newCommentSchema = z.object({
	content: z.string().min(1),
	taskId: z.string().min(1),
	userId: z.string().min(1),
	parentCommentId: z.string().optional(),
});

// types
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
export type NewProjectSchemaType = z.infer<typeof newProjectSchema>;
export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;
export type TeamFormValues = z.infer<typeof teamSchema>;
export type NewTaskSchemaType = z.infer<typeof newTaskSchema>;
export type NewCommentSchemaType = z.infer<typeof newCommentSchema>;
