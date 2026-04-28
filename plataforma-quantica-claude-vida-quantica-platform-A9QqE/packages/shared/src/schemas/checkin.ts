import { z } from "zod";

export const moodValues = [
  "feliz",
  "grato",
  "calmo",
  "focado",
  "neutro",
  "ansioso",
  "triste",
  "irritado",
  "exausto",
] as const;

export const checkinSchema = z.object({
  frequency: z.number().min(1).max(10),
  mood: z.enum(moodValues),
  energy: z.number().min(1).max(10),
  notes: z.string().max(500).optional(),
});

export type CheckinInput = z.infer<typeof checkinSchema>;
export type Mood = (typeof moodValues)[number];
