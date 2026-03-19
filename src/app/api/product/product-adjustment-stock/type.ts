import { Product } from "../type";

type Employee = {
    id: number;
    first_name: string;
    last_name: string;
};

type Location = {
    id: number;
    name: string;
};

export type ProductAdjustmentStock = {
    id: number | null;
    entity_id: number;
    location_id: number;
    employee_requested_by: Employee;
    requested_at: Date; // "YYYY-MM-DD HH:mm:ss" format
    local_requested_at: Date; // "YYYY-MM-DD HH:mm:ss" format
    request_note: string | null;
    employee_approved_by: Employee | null;
    approved_at: Date | null; // "YYYY-MM-DD HH:mm:ss" format
    local_approved_at: Date | null; // "YYYY-MM-DD HH:mm:ss" format
    approval_note: string | null;
    employee_rejected_by: Employee | null;
    rejected_at: Date | null; // "YYYY-MM-DD HH:mm:ss" format
    local_rejected_at: Date | null; // "YYYY-MM-DD HH:mm:ss" format
    rejected_note: string | null;
    code: string;
    status: string; // e.g., "requested"
    recorded_product_count: number;
    counted_product_count: number;
    difference_product_count: number;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
    note: string | null;
    auto_approve: number; // 0 or 1
    location: Location;
    product_adjustment_stock_details: ProductAdjustmentStockDetail[] | null
}

export type GetProductStockRequest = {
    product: number;
    product_unit: number;
    location: number;
};

// request
type ProductAdjustmentStockDetailRequest = {
    id: number | null,
    product_id: number;
    product_unit_id: number;
    product_category_id: number | null;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
    note: string | null;
};

export interface ProductAdjustmentStockDetail {
    id: number | null,
    product_id: number;
    product_unit_id: number;
    product_category_id: number | null;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
    product: Product;
}

export type ProductAdjustmentStockRequest = {
    id: number | null;
    location_id: number;
    auto_approve: boolean;
    note: string | null;
    recorded_product_count: number;
    counted_product_count: number;
    difference_product_count: number;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
    products: ProductAdjustmentStockDetailRequest[];
}

// Detail
export interface ProductsDetail {
    id: number,
    _deleted: boolean,
    product_id: number,
    product_unit_id: number,
    product_category_id: number | null,
    recorder_stock: number,
    counted_stock: number,
    difference_stock: number,
    note: string | null
}

export interface ParamsProductAdjustmentStock {
    id: number,
    products: ProductsDetail[]
}