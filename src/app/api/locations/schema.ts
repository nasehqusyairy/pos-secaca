import { z } from "zod";

export const LocationFormSchema = z.object({
    name: z.string().min(1), // Optional (empty string means it's not required)

    backoffice_email: z.string().email().nullable().optional(),

    backoffice_phone_number: z
        .string()
        .regex(/^\d{5,15}$/) // Numeric with 5 to 15 digits
        .nullable()
        .optional(),

    backoffice_phone_number_country_code: z
        .string()
        .regex(/^\d{1,3}$/) // Numeric with 1 to 3 digits
        .nullable()
        .optional(),

    contact_email: z.string().email().nullable().optional(),

    contact_phone_number: z
        .string()
        .regex(/^\d{5,15}$/) // Numeric with 5 to 15 digits
        .nullable()
        .optional(),

    contact_phone_number_country_code: z
        .string()
        .regex(/^\d{1,3}$/) // Numeric with 1 to 3 digits
        .nullable()
        .optional(),

    image_url: z.string().url().nullable().optional(), // Assuming image URL is provided

    icon_image_url: z.string().url().nullable().optional(), // Assuming icon image URL

    kind: z.string(), // Enum for `kind` field

    status: z.string(), // Enum for `kind` field

    full_address: z.string().max(255).nullable().optional(),

    postal_code: z.string().min(5).max(8).nullable().optional(),

    city: z.string().max(255).nullable().optional(),

    province: z.string().max(255).nullable().optional(),

    country: z.string().max(255).nullable().optional(),
    footer: z.string().nullable().optional(),

    timezone: z.string().nullable().optional(), // No built-in timezone validation in Zod

    location_hours: z.array(z.any()).nullable().optional() // Assuming location hours is an array
});
