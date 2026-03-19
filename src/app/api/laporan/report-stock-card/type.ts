export type ReportStockCardRequest = {
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

export interface ReportStockCard {
    product_name: string;
    product_unit_name: string;
    stock_in: string;
    stock_out: string;
    sell_price: number;
}