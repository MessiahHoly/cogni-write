import { z } from "zod";

export const UpdateNameSchema = z.object({
  name: z.string().min(1),
})