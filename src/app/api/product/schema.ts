import { z } from 'zod';

// Zod schema for validating an Excel file upload
export const fileUploadProductSchema = z.object({
    file: z.any()
});

export const formProductSchema = z.object({
    name: z.string().nonempty("Name is required"),
    sku: z.string().nonempty("SKU is required"), // Add uniqueness validation server-side
    barcode: z.string().nonempty("Barcode is required"), // Add uniqueness validation server-side
    description: z.string().nullable().optional(),
    sell_price: z.string().min(0, "Sell price must be at least 0"),
    last_buying_price: z.string().min(0, "Sell price must be at least 0"),
    product_category_id: z.string().nullable().optional(),
    product_unit_id: z.string().nonempty("Product unit is required"),
    product_sell_unit_id: z.string().nullable().optional(),
    // product_sell_unit_id: z.string().nonempty("Product sell unit is required"),
    location_id: z.string().nonempty("Location is required"), // Add logic to check based on entity
    image_url: z.string().nullable().optional(), // Handle image validation separately if needed
    sell_to_customer: z.string().optional(),
    service: z.string().optional(),
    modifier: z.string().optional(),
    allow_custom_price: z.string().optional(),
    select_all_location: z.string().optional(),
    location_ids: z.array(z.string()).nullable().optional(),
    exclude_location_ids: z.array(z.string()).nullable().optional(),
    tax_id: z.string().nullable().optional(),
    tax_setting: z.string().nullable().optional(),
    product_unit_conversions: z
        .array(
            z.object({
                unit_id: z.string().nonempty("Unit ID is required"),
                quantity: z.number().min(0, "Quantity must be at least 0"),
                internal_price: z.number().min(0, "Internal price must be at least 0"),
            })
        )
        .nullable().optional(),
    stock_movements: z
        .array(
            z.object({
                location_id: z.number().nullable().optional(),
                buying_price: z.number().min(-1, "Sell price must be at least 0").nullable().optional(),
                stock: z.number().min(-1, "Sell price must be at least 0").nullable().optional(),
            })
        )
        .nullable().optional(),
    product_sell_prices: z
        .array(
            z.object({
                location_id: z.string().nullable(),
                order_type_id: z.string().nullable(),
                product_unit_id: z.string().nullable(),
                tax_id: z.string().nullable(),
                tax_setting: z.string().nullable(),
                sell_price: z.number().min(0, "Sell price must be at least 0"),
            })
        )
        .nullable().optional(),
});

