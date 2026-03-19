export type Product = {
    product_id: number;
    brand_id: number;
    order_type_id: number;
    product_unit_id: number;
    product_category_id: number | null;
    catalogue_detail_id: number | null;
    quantity: number;
    sell_price: number;
    custom_price: boolean;
};

export type Products = {
    product_id?: number;
    brand_id?: number | null;
    order_type_id?: number;
    product_unit_id?: number;
    product_category_id?: number;
    catalogue_detail_id?: number | null;
    quantity?: number | null;
    sell_price?: number | null;
    custom_price?: boolean;
};


export type ProductSellPrices = {
    id?: number,
    product_id?: number,
    location_id?: number,
    order_type_id?: number,
    product_unit_id?: number,
    tax_id?: number,
    tax_setting?: number, // enum
    sell_price?: number,
    default?: boolean,
}

export type ProductLocationStocks = {
    id?: number,
    location_id?: number,
    product_id?: number,
    average_buy_price?: number,
    stock?: number,
}

export type ProductCategories = {
    id?: number;
    entity_id: number;
    name: string;
    status: string; // enum
};


export interface Adjustment {
    quantity: number;
    amount: number;
    price: number;
    promo_id: number | null;
    free_of_charge: boolean;
    is_percentage: boolean;
    discountAmount: number;
    surchargeAmount: number;
}

export type Catalogues = {
    id: number;
    name: string;
    code: string;
    barcode: string;
    image_url: string;
    sku: string;
    product_category_id: number;
    quantity: number;
    product_unit_id: number;
    sell_price: string;
    product_unit: Products;
    product_category: ProductCategories;
    product_location_stock: ProductLocationStocks;
    product_sell_price: ProductSellPrices;
    product_sell_prices: ProductSellPrices[];
    adjustment: Adjustment | null;
};
