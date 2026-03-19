export enum CustomerCategoriesResetAtEnum {
    DAILY = 'daily'
}

export type CustomerCategories = {
    id: number,
    entity_id?: number,
    name: string,
    status?: string,
    required?: boolean,
    last_reset_at?: string,
    reset_every?: CustomerCategoriesResetAtEnum, // enum
    // customer_category_rule?: CustomerCategoryRules,
}

type RequestCustomerCategories = {
    id: number;
    name: string;
    status?: string;
    required: boolean;
    reset_every: CustomerCategoriesResetAtEnum;
    customer_category_rule: CustomerCategoryRules;
};

export type {
    RequestCustomerCategories,
};

export type GetCustomerCategoryRequest = {
    limit?: number;
    search?: string | null;
    page?: number;
};

export type CustomerCategoryRules = {
    id?: number,
    customer_category_id?: number,
    minimal_spend?: number,
    include_tax?: boolean,
    include_service_charge?: boolean,
    include_promo?: boolean,
    include_surcharge?: boolean,
    include_free_of_charge?: boolean,
}
