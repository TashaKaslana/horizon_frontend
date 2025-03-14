import {z} from "zod";

export const accountFormSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
}).refine(data => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
})