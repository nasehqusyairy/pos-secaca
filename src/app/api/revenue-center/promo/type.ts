export type GetPromoRequest = {
    limit?: number;
    page?: number;
    keyword?: string;
    start_at?: Date;
    end_at?: Date;
    locs?: number[];
    select_all_location?: boolean;
    exclude_locs?: number[];
};

export type PromoRuleCustomerCategory = {
    id: number,
    customer_category_id: number,
    customer_category_name: string,
}


export interface PromoRule {
    minimum_sales_purchase?: number | null;
    promo_rule_customer_categories?: PromoRuleCustomerCategory[] | null;
    order_type_ids?: number[] | null;
}

export interface PromoReward {
    template: string,
    applied_to: string,
    percentage: boolean,
    reward_amount: number,
    reward_maximum_amount?: number | null,
    in_house_percentage: number,
}

export interface Promo {
    id: number;
    code: string;
    name: string;
    description?: string;
    start_at: Date;
    end_at?: Date;
    select_all_location: boolean;
    owner_location_id: number,
    owner_location: {
        id: number;
        name: string;
        code: string;
    };
    promo_rule: PromoRule;
    promo_reward: PromoReward;
}