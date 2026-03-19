import { z } from 'zod';

export const CustomerSchema = z.object({
    email: z.string().nullable().optional(), // Allows string or null
    first_name: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
    phone_number_country_code: z.string(),
});