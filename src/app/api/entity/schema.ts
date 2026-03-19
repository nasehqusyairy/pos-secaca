import { z } from "zod";

export const EntityFormSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().max(255).nullable().optional(),
  image_url: z.string().nullable().optional(),
  icon_image_url: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  initial: z.string().nullable().optional(),
  phone_number: z.string().min(5).max(15).nullable().optional(),
  phone_number_country_code: z.string().min(1).max(3).nullable().optional(),
  email: z.string().email().nullable().optional(),
  website: z.string().url().nullable().optional(),
  full_address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  postal_code: z.string().min(4).max(10).nullable().optional(),
  country: z.string().nullable().optional(),
  timezone: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
});
