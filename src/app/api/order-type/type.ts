export type OrderTypes = {
    id: number | null;
    entity_id: number | null;
    name: string;
    status: string; // enum
    search_name: string;
    fixed_fee: number;
    variable_fee: number;
    payment_method_id: number | null;
    require_customer_data: boolean;
};
