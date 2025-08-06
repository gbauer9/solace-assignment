import { z } from "zod";
import { AdvocateResponseSchema, AdvocateListResponseSchema } from "@/schemas/advocates";
import { advocates } from "@/db/schema";

export type AdvocateResponse = z.infer<typeof AdvocateResponseSchema>;
export type AdvocateListResponse = z.infer<typeof AdvocateListResponseSchema>;

export type SortableField = keyof Pick<typeof advocates, 
  "firstName" | "lastName" | "city" | "degree" | "yearsOfExperience"
>;