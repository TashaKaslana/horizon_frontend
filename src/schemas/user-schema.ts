import { z } from 'zod';

export const UserStatusSchema = z.enum(["Active", "Pending", "Suspended", "Deactivated"])
export const UserRoleSchema = z.enum(["Owner", "Admin", "Moderator", "User"]);

export const UserSchema = z.object({
    id: z.string(),
    displayName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    email: z.string().email(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    phoneNumber: z.string(),
    dateOfBirth: z.string(),
    profileImage: z.string().url(),
    coverImage: z.string().url(),
    bio: z.string(),
    country: z.string(),
    city: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const UserSummarySchema = UserSchema.pick({
    id: true,
    displayName: true,
    username: true,
    profileImage: true,
    coverImage: true,
    createdAt: true,
});

export const UserSummaryAdminSchema = UserSchema.pick({
    id: true,
    displayName: true,
    username: true,
    profileImage: true,
    coverImage: true,
    createdAt: true,
    email: true,
}).extend({
    status: UserStatusSchema,
    lastLogin: z.string().optional(),
    role: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type UserSummary = z.infer<typeof UserSummarySchema>;
export type UserSummaryAdmin = z.infer<typeof UserSummaryAdminSchema>;
