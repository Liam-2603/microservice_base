import { PublicUser } from "src/share";
import z from "zod";

export enum NotificationAction {
  LIKED = 'liked',
  FOLLOWED = 'followed',
  REPLIED = 'replied',
}

export const notificationSchema = z.object({
  id: z.string().uuid(),
  receiverId: z.string().uuid(),
  actorId: z.string().uuid(),
  content: z.string(),
  action: z.nativeEnum(NotificationAction),
  isSent: z.boolean().default(false),
  isRead: z.boolean().default(false),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type Notification = z.infer<typeof notificationSchema> & { sender?: PublicUser; };

export const notificationCreateDTOSchema = notificationSchema.pick({
  receiverId: true,
  actorId: true,
  content: true,
  action: true,
}).required();

export type NotificationCreateDTO = z.infer<typeof notificationCreateDTOSchema>;

export const notificationUpdateDTOSchema = notificationSchema.pick({
  isSent: true,
  isRead: true,
}).partial();

export type NotificationUpdateDTO = z.infer<typeof notificationUpdateDTOSchema>;

export const notificationCondSchema = notificationSchema.pick({
  receiverId: true,
  action: true,
}).partial();

export type NotificationCondition = z.infer<typeof notificationCondSchema>;