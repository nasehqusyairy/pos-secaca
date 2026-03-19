import { Product } from "../type";

interface TransferProduct {
    id: number;
    entity_id: number;
    from_location_id: number;
    to_location_id: number;
    employee_requested_by: number;
    requested_at: Date; // Date string (ISO format)
    local_requested_at: string; // Date string (ISO format)
    request_note: string | null;
    employee_approved_by: number;
    approved_at: string; // Date string (ISO format)
    local_approved_at: string; // Date string (ISO format)
    approval_note: string | null;
    employee_rejected_by: number | null;
    rejected_at: string; // Nullable date string
    local_rejected_at: string; // Nullable date string
    rejected_reason: string | null;
    rejected_note: string | null;
    employee_cancelled_by: number | null;
    cancelled_at: string | null; // Nullable date string
    local_cancelled_at: string | null; // Nullable date string
    cancelled_reason: string | null;
    cancelled_note: string | null;
    code: string; // UUID or code string
    supplier_name: string | null;
    status: "approved" | "pending" | "rejected" | "cancelled"; // Status string (can be extended)
    note: string | null;
    auto_approve: number;
    from_location: Location;
    to_location: Location;
    product_transfer_service_details: ProductTransferDetail[];
}

interface Location {
    id: number;
    name: string;
}

// request
interface ProductTransferDetail {
    id?: number;
    product_id: number;
    product_unit_id: number;
    quantity: number;
    line_amount: number;
    product?: Product;
}

interface TransferProductRequest {
    id: number | null | undefined;
    from_location_id: number;
    to_location_id: number;
    auto_approve: boolean;
    request_note: string | null;
    products: ProductTransferDetail[];
}

interface GetTransferProductRequest {
    startDate: Date | undefined;
    endDate: Date | undefined;
    fromLocs: number[];
    fromSelectAllLocation: boolean;
    fromExcludeLocs: number[];
    toLocs: number[];
    toSelectAllLocation: boolean;
    toExcludeLocs: number[];
}

export type { TransferProduct, TransferProductRequest, ProductTransferDetail, GetTransferProductRequest };
