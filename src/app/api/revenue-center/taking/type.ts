export interface TakingPaymenDetails {
    id: number;
    taking_id: number;
    payment_method_id: number;
    sales_amount: number;
    sales_count: number;
    refund_amount: number;
    refund_count: number;
    counted_amount: number;
    recorded_amount: number;
    difference_amount: number;
    money_movement_in_amount: number;
    money_movement_in_count: number;
    money_movement_out_amount: number;
    money_movement_out_count: number;
    customer_deposit_amount: number;
    customer_deposit_count: number;
    product_sold_count: number;
    product_category_sold_count: number;
    product_return_count: number;
    product_category_return_count: number;
    payment_method: {
        id: number;
        name: string;
    };
}

export interface Taking {
    id: number;
    device_id: number;
    location_id: number;
    entity_id: number;
    checkpoint_device_id: number;
    employee_id: number;
    parent_id: number | null;
    is_shift: boolean;
    taking_at: string;
    local_taking_at: string;
    last_taking_at: string;
    sales_amount: number;
    refund_amount: number;
    shift_number: number;
    sales_count: number;
    refund_count: number;
    gross_sales: number;
    gross_refund: number;
    discount_amount: number;
    discount_amount_refund: number;
    promo_amount: number;
    promo_amount_refund: number;
    surcharge_amount: number;
    surcharge_amount_refund: number;
    free_of_charge_amount: number;
    free_of_charge_amount_refund: number;
    net_sales: number;
    net_sales_refund: number;
    service_charge: number;
    service_charge_refund: number;
    tax_amount: number;
    tax_amount_refund: number;
    net_sales_after_tax: number;
    net_sales_after_tax_refund: number;
    location?: {
        id: number;
        name: string;
    };
    taking_payment_details?: TakingPaymenDetails[];
    employee_first_name: string;
    employee_last_name: string;
}

export type GetDailySaleRequest = {
    limit?: number;
    page?: number;
    start_at?: Date;
    end_at?: Date;
    loc?: number;
};

export interface DailySale {
    id: number;
    entity_id: number;
    location_id: number;
    taking_id: number;
    employee_id: number;
    local_sales_at: string;
    sales_amount: number;
    refund_amount: number;
    location?: {
        id: number;
        name: string;
    };
    takingAll?: Taking;
    takings?: Taking[];
    employee_first_name: string;
    employee_last_name: string;
}