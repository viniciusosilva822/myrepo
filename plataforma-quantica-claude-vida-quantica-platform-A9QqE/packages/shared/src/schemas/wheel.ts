import { z } from "zod";

export const wheelAreas = [
  "saude",
  "carreira",
  "financas",
  "relacionamentos",
  "familia",
  "espiritualidade",
  "lazer",
  "desenvolvimento",
] as const;

export const wheelEntrySchema = z.object({
  saude: z.number().min(0).max(10),
  carreira: z.number().min(0).max(10),
  financas: z.number().min(0).max(10),
  relacionamentos: z.number().min(0).max(10),
  familia: z.number().min(0).max(10),
  espiritualidade: z.number().min(0).max(10),
  lazer: z.number().min(0).max(10),
  desenvolvimento: z.number().min(0).max(10),
  notes: z.string().max(1000).optional(),
});

export type WheelEntryInput = z.infer<typeof wheelEntrySchema>;
export type WheelArea = (typeof wheelAreas)[number];
