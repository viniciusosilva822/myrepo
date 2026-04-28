import { z } from "zod";

export const contentTypes = ["EBOOK", "AUDIO", "VIDEO", "ARTICLE"] as const;

export const createContentSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(contentTypes),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  category: z.string().max(40).optional(),
  durationSec: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
});

export const createLiveSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  scheduledAt: z.string().datetime(),
  recordingUrl: z.string().url().optional(),
  joinUrl: z.string().url().optional(),
});

export type CreateContentInput = z.infer<typeof createContentSchema>;
export type CreateLiveInput = z.infer<typeof createLiveSchema>;
export type ContentType = (typeof contentTypes)[number];
