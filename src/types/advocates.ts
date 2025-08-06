import { z } from "zod";
import { AdvocateResponseSchema, AdvocateListResponseSchema } from "@/schemas/advocates";

export type AdvocateResponse = z.infer<typeof AdvocateResponseSchema>;
export type AdvocateListResponse = z.infer<typeof AdvocateListResponseSchema>;