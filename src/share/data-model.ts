import { v7 } from "uuid";
import z from "zod";

export enum BaseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export enum PostType {
  TEXT = 'text',
  MEDIA = 'media',
}

export const publicUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().url(),
});

export interface PublicUser extends z.infer<typeof publicUserSchema> {}

export const pagingDTOSchema = z.object({
  page: z.coerce.number().min(1, { message: 'Page number must be at least 1' }).default(1),
  limit: z.coerce.number().min(1, { message: 'Limit must be at least 1' }).max(100).default(20),
  sort: z.string().optional(),
  order: z.string().optional(),
});
export interface PagingDTO extends z.infer<typeof pagingDTOSchema> { total?: number; }


export type Paginated<E> = {
  data: E[];
  paging: PagingDTO,
  total: number;
};

export class PubSubMessage {
  public readonly ID: string;
  public readonly SenderID?: string;
  public readonly Topic: string;
  public readonly Payload: Record<string, any>;
  public readonly CreatedAt: Date;
  constructor(senderID: string | undefined, topic: string, payload: Record<string, any>) {
    ; (this.ID = v7()), (this.SenderID = senderID), (this.Topic = topic), (this.Payload = payload);
    this.CreatedAt = new Date();
  }
}

export const topicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  postCount: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface Topic extends z.infer<typeof topicSchema> {}

export const postSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
  author: publicUserSchema,
  content: z.string().min(1),
  image: z.string().url().optional(),
  topicId: z.string().uuid(),
  topic: topicSchema,
  isFeatured: z.boolean().default(false),
  commentCount: z.number().int().nonnegative().default(0),
  likedCount: z.number().int().nonnegative().default(0),
  type: z.nativeEnum(PostType),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export interface Post extends z.infer<typeof postSchema> {}


// 200Lab note: For event-driven architecture
// All events should extend this class
export abstract class AppEvent<Payload> {
  private _id: string;
  private _occurredAt: Date;
  private _senderId?: string;

  constructor(
    private readonly _eventName: string,
    private readonly _payload: Payload,
    dtoProps?: {
      id?: string,
      occurredAt?: Date,
      senderId?: string;
    }
  ) {
    this._id = dtoProps?.id ?? v7();
    this._occurredAt = dtoProps?.occurredAt ?? new Date();
    this._senderId = dtoProps?.senderId;
  }

  get eventName(): string {
    return this._eventName;
  }

  get id(): string {
    return this._id;
  }

  get occurredAt(): Date {
    return this._occurredAt;
  }

  get senderId(): string | undefined {
    return this._senderId;
  }

  get payload(): Payload {
    return this._payload;
  }

  plainObject() {
    return {
      id: this._id,
      occurredAt: this._occurredAt,
      senderId: this._senderId,
      eventName: this._eventName,
      payload: this._payload,
    };
  }
}