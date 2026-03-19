import { z } from 'zod';
import { CustomerCategoriesResetAtEnum } from './type';

export const formCustomerCategorySchema = z.object({
    name: z.string().nonempty("Name is required"),
    required: z.boolean().default(false),
    reset_every: z.nativeEnum(CustomerCategoriesResetAtEnum).default(CustomerCategoriesResetAtEnum.DAILY),
    customer_category_rule: z.object({
        minimal_spend: z.coerce.number().default(0),
        include_tax: z.boolean().default(true),
        include_service_charge: z.boolean().default(true),
        include_promo: z.boolean().default(true),
        include_surcharge: z.boolean().default(true),
        include_free_of_charge: z.boolean().default(true),
    })
})