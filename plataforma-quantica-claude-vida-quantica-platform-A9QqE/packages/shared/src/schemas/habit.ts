import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(2).max(60),
  icon: z.string().max(8).optional(),
  color: z.string().max(20).optional(),
  targetPerWeek: z.number().int().min(1).max(7).default(7),
});

export const completeHabitSchema = z.object({
  habitId: z.string(),
  date: z.string().optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type CompleteHabitInput = z.infer<typeof completeHabitSchema>;
