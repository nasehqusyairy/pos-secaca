import { z } from "zod";

export const ProductCategoryFormSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().nonempty(),
})