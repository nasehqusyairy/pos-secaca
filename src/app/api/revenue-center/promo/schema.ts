import { z } from 'zod';

export const promoRewardTemplateEnum = z.enum(['discount_percentage', 'discount_fixed', 'get_product', 'special_price']);
export const promoRewardAppliedToEnum = z.enum(['total_order', 'product', 'product_category']);

export const formPromoSchema = z.object({
    name: z.string({
        required_error: "Promo is required",
    }),
    description: z.string().optional(),
    owner_location_id: z.string({
        required_error: "Reward amount is required",
    }),
    owner_location: z.object({
        id: z.number(),
        name: z.string(),
    }).optional(),
    channel: z.enum(['pos']).default('pos'),
    start_at: z.string().date().nonempty('Start date is required'),
    end_at: z.string().date().optional(),
    goal: z.enum(['increase_sales']).default('increase_sales'),
    auto_apply: z.boolean().default(true),
    combine_promo: z.boolean().default(true),
    select_all_location: z.boolean().default(true),
    promo_rule: z.object({
        show_minimum_sales_purchase: z.boolean().default(false),
        minimum_sales_purchase: z.string().optional(),
        show_customer_category_ids: z.boolean().default(false),
        customer_category_ids: z.array(z.string().readonly()).optional(),
        order_type_ids: z.array(z.string()).optional(),
    }),
    promo_reward: z.object({
        template: promoRewardTemplateEnum,
        applied_to: promoRewardAppliedToEnum.default('total_order'),
        percentage: z.boolean().default(false),
        reward_amount: z.string({
            required_error: "Reward amount is required",
        }),
        reward_maximum_amount: z.string().optional(),
        in_house_percentage: z.string().default('100'),
    })
});

