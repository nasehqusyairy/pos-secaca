import { z } from "zod";

export const orderTypeFormSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().nonempty(),
    fixed_fee: z.string().min(0),
    variable_fee: z.string().min(0),
    require_customer_data: z.string(),
    payment_method_id: z.string().nullable().optional()
});
