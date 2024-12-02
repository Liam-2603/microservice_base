import { PublicUser } from "src/share";
import { z } from "zod";

export const ErrFollowYourself = new Error('You cannot follow yourself');
export const ErrAlreadyFollowed = new Error('You have already followed this user');
export const ErrFollowNotFound = new Error('Follow relationship not found');

export const followDTOSchema = z.object({
  followerId: z.string().uuid(),
  followingId: z.string().uuid()
});
export type FollowDTO = z.infer<typeof followDTOSchema>;

export const followCondDTOSchema = z.object({
  followingId: z.string().uuid().optional(),
  followerId: z.string().uuid().optional()
});

export type FollowCondDTO = z.infer<typeof followCondDTOSchema>;

export const followSchema = z.object({
  followerId: z.string().uuid(),
  followingId: z.string().uuid(),
  createdAt: z.date().default(new Date())
});
export type Follow = z.infer<typeof followSchema>;

export type Follower = PublicUser & {
  hasFollowedBack: boolean;
  followedAt: Date;
};