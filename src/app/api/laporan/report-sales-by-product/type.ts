export type ReportSalesByProductRequest = {
    limit?: number;
    page?: number;
    keyword?: string;
    start_at?: Date;
    end_at?: Date;
    locs?: number[];
    discounted?: string;
    select_all_location?: boolean;
    exclude_locs?: number[];
};

export interface ReportSalesByProduct {
    product_name: string;
    product_sku: string;
    product_category_name: string;
    quantity: string;
    cancelled_quantity: string;
    gross_sales: string;
    gross_profit: string;
    gross_refund: string;
    discount_amount: string;
    discount_amount_before_tax: string;
    surcharge_amount_before_tax: string;
    net_sales: string;
    tax_amount: string;
    net_sales_after_tax: string;
    net_profit: string;
    total_amount: string;
    sell_price: string;
    cost_of_goods_sold: string;
    cashier_id: number;
    cashier_first_name: string;
    cashier_last_name: string;
    employee_sales_id: number;
    employee_sales_first_name: string;
    employee_sales_last_name: string;
    customer_id: number;
    customer_first_name: string;
    customer_last_name: string;
}