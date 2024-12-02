import { z } from 'zod';
export const ErrPostNotFound = new Error('Post not found');
export const ErrPostAlreadyLiked = new Error('Post already liked');
export const ErrPostHasNotLiked = new Error('Post has not liked');

export const postLikeSchema = z.object({
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  createdAt: z.date().default(new Date()),
});

export type PostLike = z.infer<typeof postLikeSchema>;

export const actionDTOSchema = postLikeSchema.pick({
  userId: true,
  postId: true,
});

export type ActionDTO = z.infer<typeof actionDTOSchema>;
