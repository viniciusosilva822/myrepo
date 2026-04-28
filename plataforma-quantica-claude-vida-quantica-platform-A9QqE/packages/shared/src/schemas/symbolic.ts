import { z } from "zod";

export const numerologyInputSchema = z.object({
  fullName: z.string().min(2),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD"),
});

export const chakraQuizSchema = z.object({
  answers: z.array(z.number().min(1).max(5)).length(21),
});

export const eneagramQuizSchema = z.object({
  answers: z.array(z.number().min(1).max(5)).length(27),
});

export type NumerologyInput = z.infer<typeof numerologyInputSchema>;
export type ChakraQuizInput = z.infer<typeof chakraQuizSchema>;
export type EneagramQuizInput = z.infer<typeof eneagramQuizSchema>;
