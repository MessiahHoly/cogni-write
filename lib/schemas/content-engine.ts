import { z } from "zod";
// import { toSlug } from "../utils";
// import { resolveUniqueSlug } from "../data/content-engine";
// import { fetchContentEngineBySlug } from "../data/content-engine";

export const CreateContentEngineSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
});

export type CreateContentEngineInput = z.infer<typeof CreateContentEngineSchema>;