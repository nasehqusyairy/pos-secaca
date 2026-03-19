export type ReportStockMovementRequest = {
    limit?: number;
    page?: number;
    keyword?: string;
    start_at?: Date;
    end_at?: Date;
    locs?: number[];
    select_all_location?: boolean;
    exclude_locs?: number[];
    prods?: number[];
    select_all_product?: boolean;
    exclude_prods?: number[];
};

export interface ReportStockMovement {
    product_name: string;
    location_name: string;
    product_unit_name: string;
    created_at: string;
    stock_in: string;
    stock_out: string;
    sell_price: number;
}

export type SaleTransasctionPayment = {
    id: number,
    payment_method_id: number,
    payment_method_name: string,
    amount_receive: number,
    change: number,
    approval_code?: string,
    card_number?: string,
}

export type GetSaleTransactionRequest = {
    limit?: number;
    page?: number;
    start_at: Date;
    end_at: Date;
    locs?: number[];
    exclude_locs?: number[];
    select_all_location: boolean;
};