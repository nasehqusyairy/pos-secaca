import { z } from "zod";

export const signInFormSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Email is not valid" }),
    devide_id: z.string({ required_error: "Device ID is required" }).optional(),
    device_name: z.string({ required_error: "Device name is required" }).optional(),
    password: z.string({ required_error: "Password is required" }),

});