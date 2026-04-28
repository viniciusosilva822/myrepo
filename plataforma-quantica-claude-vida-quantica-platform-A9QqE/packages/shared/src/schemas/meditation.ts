import { z } from "zod";

export const meditationCategories = [
  "ansiedade",
  "sono",
  "foco",
  "abundancia",
  "autoestima",
  "gratidao",
  "respiracao",
  "frequencia",
] as const;

export const logMeditationSchema = z.object({
  meditationId: z.string().optional(),
  durationSec: z.number().int().min(30).max(7200),
  category: z.enum(meditationCategories).optional(),
});

export type LogMeditationInput = z.infer<typeof logMeditationSchema>;
export type MeditationCategory = (typeof meditationCategories)[number];
