export type ReportSalesByLocationRequest = {
    limit?: number;
    page?: number;
    keyword?: string;
    start_at?: Date;
    end_at?: Date;
    locs?: number[];
    select_all_location?: boolean;
    exclude_locs?: number[];
    discounted: string;
};

export interface ReportSalesByLocation {
    location_name: string;
    quantity: string;
    cancelled_quantity: string;
    gross_sales: string;
    cost_of_goods_sold: string;
    gross_refund: string;
    discount_amount: string;
    total_amount: string;
    gross_profit: string;
    net_profit: string;
}