export type ProductDropdown = {
    id: number;
    name: string;
    sku: string;
    barcode: string;
    sell_price: string;
    product_unit?: {
        id: number;
        name: string;
    };
    product_category?: {
        id: number;
        name: string;
    };
    product_sell_unit?: {
        id: number;
        name: string;
    };
}

export type ProductCategoryDropdown = {
    id: number;
    name: string;
}
