export type ReportSalesRequest = {
    limit?: number;
    page?: number;
    keyword?: string;
    start_at?: Date;
    end_at?: Date;
    discounted?: string,
    locs?: number[];
    select_all_location?: boolean;
    exclude_locs?: number[];
};

export interface ReportSales {
    code: string;
    receipt_no: string;
    location_name: string;
    local_sales_at: string;
    gross_sales: number;
    discount_amount_before_tax: number;
    surcharge_amount_before_tax: number;
    net_sales: number;
    tax_amount: number;
    net_sales_after_tax: number;
}