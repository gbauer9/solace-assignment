import { z } from "zod";

export const AdvocatesQuerySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().min(1),
    pageSize: z.coerce.number().min(1).max(50),
});

export const AdvocateResponseSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    city: z.string(),
    degree: z.string(),
    specialties: z.array(z.string()),
    yearsOfExperience: z.number(),
    phoneNumber: z.number(),
    createdAt: z.coerce.date().optional(),
});

export const AdvocateListResponseSchema = z.array(AdvocateResponseSchema);