export type GetLoyaltyRequest = {
    limit?: number;
    page?: number;
    keyword?: string;
};

export type LoyaltyRewardProduct = {
    id?: number,
    loyalty_id?: number,
    product_id: number,
    product_unit_id: number,
    point_needed: number,
    maximum_quantity: number | null,
    _destroy: boolean,
    product?: {
        id: number,
        name: string,
        sku: string,
        barcode: string,
        sell_price: string,
    };
    product_unit?: {
        id: number,
        name: string,
    };
}

export type Loyalties = {
    id: number,
    entity_id?: number,
    name: string,
    miniminal_transaction_value: number,
    reward_point: number,
    allow_multiple?: boolean,
    include_tax_and_service_charge?: boolean,
    include_promo?: boolean,
    active?: boolean,
    description?: string,
    status: string,
    select_all_location?: boolean,
    allow_convert_point_as_amount?: boolean,
    conversion_point?: number,
    conversion_amount?: number,
    reward_products: LoyaltyRewardProduct[],
}