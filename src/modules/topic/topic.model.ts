import z from "zod";

export const ErrTopicNotFound = new Error("Topic not found");
export const ErrTopicNameInvalid = new Error("Topic name is invalid, must be at least 3 characters");
export const ErrTopicNameAlreadyExists = new Error("Topic name already exists");
export const ErrTopicColorInvalid = new Error("Topic color is invalid, must be a valid hex color code");

export const topicSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, ErrTopicNameInvalid.message),
  postCount: z.number().int().nonnegative().default(0),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/i, ErrTopicColorInvalid.message).default('#008000'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Topic = z.infer<typeof topicSchema>;

export const topicCreationDTOSchema = topicSchema.pick({ name: true, color: true });

export type TopicCreationDTO = z.infer<typeof topicCreationDTOSchema>;

export const topicUpdateDTOSchema = topicSchema.pick({ name: true, color: true }).partial();

export type TopicUpdateDTO = z.infer<typeof topicUpdateDTOSchema>;

export const topicCondDTOSchema = z.object({
  name: z.string().optional(),
});

export type TopicCondDTO = z.infer<typeof topicCondDTOSchema>;
