import { z } from 'zod';

const ProductSchema = z.object({
    id: z.number().optional().nullable(),
    product_id: z.number(),
    product_unit_id: z.number(),
    product_category_id: z.number().nullable().optional(),
    recorded_stock: z.number(),
    counted_stock: z.number(),
    difference_stock: z.number(),
    note: z.string().nullable().optional(),
});

export const formProductAdjustmentStockRequestSchema = z.object({
    date: z.string().optional(),
    location_id: z.string(),
    auto_approve: z.boolean().optional(),
    note: z.string().nullable().optional(),
    recorded_product_count: z.string().optional(),
    counted_product_count: z.string().optional(),
    difference_product_count: z.string().optional(),
    recorded_stock: z.string().optional(),
    counted_stock: z.string().optional(),
    difference_stock: z.string().optional(),
    products: z.array(ProductSchema),
});