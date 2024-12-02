import { z } from 'zod';

export const ErrPostNotFound = new Error('Post not found');
export const ErrPostAlreadySaved = new Error('Post already saved');
export const ErrPostHasNotSaved = new Error('Post has not saved');

export const postSaveSchema = z.object({
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  createdAt: z.date().default(new Date()),
});

export type PostSave = z.infer<typeof postSaveSchema>;

export const actionDTOSchema = z.object({
  userId: z.string().uuid(),
  postId: z.string().uuid(),
});

export type ActionDTO = z.infer<typeof actionDTOSchema>
