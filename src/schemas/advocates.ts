import { z } from "zod";

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