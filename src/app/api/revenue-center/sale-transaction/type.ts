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

export type VoidSaleTransactionParams = {
    id: number | string;
    reason: string;
    notes: string;
}