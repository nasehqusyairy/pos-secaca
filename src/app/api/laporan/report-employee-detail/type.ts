export type ReportEmployeeDetailRequest = {
    limit?: number;
    page?: number;
    keyword?: string;
    start_at?: Date;
    end_at?: Date;
    locs?: number[];
    select_all_location?: boolean;
    exclude_locs?: number[];
    employees?: number[];
    select_all_employee?: boolean;
    exclude_employees?: number[];
};

export interface ReportEmployeeDetail {
    employee_sales_name: string;
    location_name: string;
    local_sales_date: string;
    sales_amount: number;
    refund_amount: number;
    net_sales_amount: number;
    sales_count: number;
    refund_count: number;
    net_count: number;
    sales_quantity: number;
    refund_quantity: number;
    net_quantity: number;
}