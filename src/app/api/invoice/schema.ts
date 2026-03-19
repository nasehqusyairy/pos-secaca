import { z } from "zod";

export const RefundFormSchema = z.object({
    sale_transaction_details: z.array(z.object({
        id: z.number().nullable().optional(),
        quantity: z.number().nullable().optional(),
    }).nullable().optional()),
    reason: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    payments: z.array(z.object({
        payment_method_id: z.number().nullable().optional(),
        amount: z.number().nullable().optional(),
        change: z.number().nullable().optional(),
    }).nullable().optional())
});
