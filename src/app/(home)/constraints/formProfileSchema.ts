import { z } from "zod";

const formProfileSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must not exceed 20 characters" }),

    displayName: z
        .string({ required_error: "Display name is required" })
        .min(3, { message: "Display name must be at least 3 characters long" })
        .max(50, { message: "Display name must not exceed 50 characters" }),

    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),

    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must not exceed 20 characters" }),

    gender: z.enum(["male", "female"], {
        message: "Gender must be either 'male' or 'female'",
    }),

    country: z
        .string({ required_error: "Country is required" })
        .min(2, { message: "Country name must be at least 2 characters long" })
        .max(50, { message: "Country name must not exceed 50 characters" }),

    birthday: z.date({ required_error: "A date of birth is required" }),

    phoneNumber: z
        .string({ required_error: "Phone number is required" })
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .max(15, { message: "Phone number must not exceed 15 digits" }),
});

export default formProfileSchema;
