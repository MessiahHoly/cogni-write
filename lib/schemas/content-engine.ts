import { z } from "zod";

export const CreateContentEngineSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
});

export type CreateContentEngineInput = z.infer<typeof CreateContentEngineSchema>;