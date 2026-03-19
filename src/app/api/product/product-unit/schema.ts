import { z } from "zod";

export const ProductUnitFormSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().nonempty(),
})