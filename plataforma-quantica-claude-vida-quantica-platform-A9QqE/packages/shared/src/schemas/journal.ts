import { z } from "zod";

export const journalEntrySchema = z.object({
  promptId: z.string().optional(),
  content: z.string().min(1).max(10000),
  mood: z.string().optional(),
});

export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
