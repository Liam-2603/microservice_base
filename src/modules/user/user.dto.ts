import { z } from 'zod';
import { userSchema } from './user.model';

export const userRegistrationDTOSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  username: true,
  password: true,
}).required();

export const userLoginDTOSchema = userSchema.pick({
  username: true,
  password: true,
}).required();

export interface UserRegistrationDTO extends z.infer<typeof userRegistrationDTOSchema> {}
export interface UserLoginDTO extends z.infer<typeof userLoginDTOSchema> {}

export const userUpdateDTOSchema = userSchema.pick({
  avatar: true,
  cover: true,
  firstName: true,
  lastName: true,
  password: true,
  bio: true,
  websiteUrl: true,
  salt: true,
  role: true,
  status: true,
}).partial();

export interface UserUpdateDTO extends z.infer<typeof userUpdateDTOSchema> {}

// 200Lab TODO: Don't allow update role and status
// but allow update role and status for admin only
export const userUpdateProfileDTOSchema = userUpdateDTOSchema.omit({
  role: true,
  status: true,
}).partial();

export const userCondDTOSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  username: true,
  role: true,
  status: true,
}).partial();

export interface UserCondDTO extends z.infer<typeof userCondDTOSchema> {}
export interface UserUpdateProfileDTO extends z.infer<typeof userUpdateProfileDTOSchema> {}
