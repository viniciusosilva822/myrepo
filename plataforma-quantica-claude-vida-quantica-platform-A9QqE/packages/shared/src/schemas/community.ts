import { z } from "zod";

export const postKinds = ["GRATIDAO", "CONQUISTA", "REFLEXAO"] as const;

export const createPostSchema = z.object({
  kind: z.enum(postKinds),
  content: z.string().min(2).max(2000),
});

export const reactToPostSchema = z.object({
  postId: z.string(),
  reaction: z.enum(["LUZ", "AMOR", "GRATIDAO"]),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type ReactToPostInput = z.infer<typeof reactToPostSchema>;
export type PostKind = (typeof postKinds)[number];
