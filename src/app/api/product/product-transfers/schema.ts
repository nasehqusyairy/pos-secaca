import { z } from 'zod';

const productSchema = z.object({
    id: z.number().nullable().optional(),
    product_id: z.number(),
    quantity: z.number().min(1), // Assuming quantity cannot be less than 1
});

export const formTransferRequestSchema = z.object({
    from_location_id: z.string().nonempty(),
    to_location_id: z.string().nonempty(),
    auto_approve: z.boolean().optional(), // Allow null for auto_approve
    request_note: z.string().nullable().optional(), // Allow null for request_note
    products: z.array(productSchema).nonempty(), // Array of products
});