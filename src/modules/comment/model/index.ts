import z from "zod";

export const ErrInvalidContent = new Error('Content must be at least 1 character long');
export const ErrCannotEmpty = new Error('Content cannot be empty');
export const ErrInvalidParentId = new Error('Invalid parent id');
export const ErrPostNotFound = new Error('Post not found');


export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELETED = 'deleted',
  SPAM = 'spam'
}
export const commentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  parentId: z.string().uuid().nullable().optional(),
  content: z.string().min(1, ErrInvalidContent.message),
  likedCount: z.number().int().nonnegative().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.nativeEnum(CommentStatus).default(CommentStatus.APPROVED),
  replyCount: z.number().int().nonnegative().default(0)
});

export type Comment = z.infer<typeof commentSchema>;

// Create DTO
export const commentCreateDTOSchema = commentSchema.pick({
  userId: true,
  postId: true,
  parentId: true,
  content: true,
});
export type CommentCreateDTO = z.infer<typeof commentCreateDTOSchema>;

// Update DTO
export const commentUpdateDTOSchema = commentSchema.pick({
  content: true,
}).partial();

export type CommentUpdateDTO = z.infer<typeof commentUpdateDTOSchema>;

// Condition DTO
export const commentCondDTOSchema = commentSchema.pick({
  postId: true,
  parentId: true,
}).partial();

export type CommentCondDTO = z.infer<typeof commentCondDTOSchema>;
