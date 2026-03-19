import { z } from "zod";

export const TaxesFormSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().nonempty(),
    rate: z.string().nonempty(),
})