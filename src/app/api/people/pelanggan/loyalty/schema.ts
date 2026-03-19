import { z } from 'zod';

export const formLoyaltySchema = z.object({
    name: z.string({
        required_error: "Loyalty name is required",
    }),
    description: z.string().optional(),
    miniminal_transaction_value: z.coerce.number({
        required_error: "Loyalty name is required",
    }).min(1),
    reward_point: z.coerce.number().min(1),
    conversion_point: z.coerce.number().nullable().optional(),
    conversion_amount: z.coerce.number().nullable().optional(),
    allow_multiple: z.boolean().default(true),
    include_discount_and_promo: z.boolean().default(true),
    include_surcharge: z.boolean().default(true),
    include_free_of_charge: z.boolean().default(true),
    include_tax: z.boolean().default(true),
    include_service_charge: z.boolean().default(true),
    select_all_location: z.boolean().default(true),
    allow_convert_point_as_amount: z.boolean().default(false),
    reward_products: z.array(z.object({
        id: z.coerce.number().optional(),
        product_id: z.coerce.number(),
        product_unit_id: z.coerce.number(),
        point_needed: z.coerce.number().min(1),
        maximum_quantity: z.coerce.number().nullable().optional(),
        _destroy: z.boolean().default(false),
    })),
});

