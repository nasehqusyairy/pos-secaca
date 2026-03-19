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

export type ProductOpnameResponse = {
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
    product_opname_service_details: ProductOpnameServiceDetail[] | null
}

export type GetProductStockOpnameQueryRequest = {
    startDate: Date | undefined;
    endDate: Date | undefined;
    statuses: string[];
    select_all_location: boolean;
    locs: number[];
    exclude_locs: number[];
    limit: number;
    page: number;
};

export type GetProductStockOneQueryRequest = {
    product: number;
    product_unit: number;
    location: number;
};

export type GetProductOpnamePreviewRequest = {
    id: number;
    limit: number;
    page: number;
    show_all: boolean;
    show_difference: boolean;
};

type ProductOpnameServiceDetail = {
    id: number | null,
    product_id: number;
    product_unit_id: number;
    product_category_id: number | null;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
    note: string | null;
    product: Product;
};

export interface ProductOpnameDetail {
    id: number | null,
    product_id: number;
    product_unit_id: number;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
}

export type ProductOpnameRequest = {
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
    product_opname_service_details: ProductOpnameServiceDetail[];
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

export interface ParamsProductOpname {
    id: number,
    products: ProductsDetail[]
}