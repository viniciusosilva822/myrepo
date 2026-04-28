import { z } from "zod";

export const grantAccessSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  source: z.string().default("manual"),
});

export const createMantraSchema = z.object({
  text: z.string().min(2).max(280),
  author: z.string().max(80).optional(),
});

export const createMeditationSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().max(1000).optional(),
  audioUrl: z.string().url(),
  durationSec: z.number().int().min(30),
  category: z.string().max(40),
  thumbnailUrl: z.string().url().optional(),
});

export type GrantAccessInput = z.infer<typeof grantAccessSchema>;
export type CreateMantraInput = z.infer<typeof createMantraSchema>;
export type CreateMeditationInput = z.infer<typeof createMeditationSchema>;
