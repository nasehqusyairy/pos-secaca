import { z } from "zod";

export const BrandFormSchema = z.object({
    id: z.number().nullable().optional(),
    entity_id: z.number().nullable().optional(),
    name: z.string().min(3).nullable(),
    image_url: z.any().optional(),
    icon_image_url: z.any().optional(),
});   
