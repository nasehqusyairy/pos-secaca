import { z } from "zod";

export const PaymentMethodFormSchema = z.object({
    name: z.string().nonempty(),
    kind: z.string(),
    icon_image_url: z.string().nullable().optional(),
    fixed_fee: z.string().min(0),
    variable_fee: z.string().min(0)
});
