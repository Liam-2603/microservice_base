import { PublicUser } from "src/share/data-model";
import z from "zod";

export const ErrPostNotFound = new Error('Post not found');
export const ErrAuthorNotFound = new Error('Author not found');
export const ErrMinContent = (num: number) => new Error(`The content must be at least ${num} characters`);
export const ErrURLInvalid = new Error('Invalid URL');
export const ErrTopicNotFound = new Error("Topic not found");
export const ErrTopicNameInvalid = new Error("Topic name is invalid, must be at least 3 characters");
export const ErrTopicNameAlreadyExists = new Error("Topic name already exists");
export const ErrTopicColorInvalid = new Error("Topic color is invalid, must be a valid hex color code");

export enum Type {
  TEXT = 'text',
  MEDIA = 'media',
}

export const postSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, { message: ErrMinContent(1).message }),
  image: z.string().url({ message: ErrURLInvalid.message }).optional(),
  authorId: z.string().uuid(),
  topicId: z.string().uuid(),
  isFeatured: z.boolean().optional().default(false),
  commentCount: z.number().int().nonnegative().default(0),
  likedCount: z.number().int().nonnegative().default(0),
  type: z.nativeEnum(Type),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type Post = z.infer<typeof postSchema> & { topic?: Topic; author?: PublicUser; hasLiked?: boolean; hasSaved?: boolean; };

export const postCondDTOSchema = z.object({
  str: z.string().optional(),
  userId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  isFeatured: z.preprocess(v => v === 'true', z.boolean()).optional(),
  type: z.nativeEnum(Type).optional(),
});

export type PostCondDTO = z.infer<typeof postCondDTOSchema>;

export const createPostDTOSchema = postSchema.pick({
  content: true,
  image: true,
  authorId: true,
  topicId: true,
}).required();

export type CreatePostDTO = z.infer<typeof createPostDTOSchema>;

export const updatePostDTOSchema = postSchema.pick({
  content: true,
  image: true,
  topicId: true,
  isFeatured: true,
  type: true,
  updatedAt: true,
}).partial();

export type UpdatePostDTO = z.infer<typeof updatePostDTOSchema>;

// 200Lab note: we duplicate the topic schema here because we don't want to import the topic module here
export const topicSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, ErrTopicNameInvalid.message),
  postCount: z.number().int().nonnegative().default(0),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/i, ErrTopicColorInvalid.message).default('#008000'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Topic = z.infer<typeof topicSchema>;