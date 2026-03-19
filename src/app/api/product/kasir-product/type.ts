export interface Product {
    id: number;
    sell_price: number;
    sku: string;
    barcode: string;
    code: string;
    name: string;
}

export interface ProductUnit {
    id: number;
    name: string;
}

export interface Location {
    id: number;
    name: string;
}

export interface Stock {
    id: number;
    product_id: number;
    location_id: number;
    product_unit_id: number;
    stock: number;
    last_in_stock: number;
    last_out_stock: number;
    last_buy_price: number;
    average_buy_price: number;
    lowest_buy_price: number;
    highest_buy_price: number;
    created_at: string; // ISO 8601 format
    updated_at: string;
    updated_by: number | null;
    created_by: number | null;
    deleted_at: string | null;
    product: Product;
    product_unit: ProductUnit;
    location: Location;
}

// Detail Product
export interface ProductLocationStock {
    id: number;
    product_id: number;
    location_id: number;
    product_unit_id: number;
    stock: number;
    last_in_stock: number;
    last_out_stock: number;
    last_buy_price: number;
    average_buy_price: number;
    lowest_buy_price: number;
    highest_buy_price: number;
    created_at: string; // ISO 8601 format
    updated_at: string;
    updated_by: number | null;
    created_by: number | null;
    deleted_at: string | null;
    product: Product;
    product_unit: ProductUnit;
    location: Location;
}

export interface ProductStockMovement {
    id: number;
    product_id: number;
    location_id: number;
    product_unit_id: number;
    original_product_unit_id: number;
    resource_type: string;
    resource_id: number;
    original_stock_in: number;
    original_stock_out: number;
    original_buying_price: number;
    conversion_stock: number;
    stock_in: number;
    stock_out: number;
    buying_price: number;
    product: Product;
    created_at: string;
    updated_at: string;
    updated_by: number | null;
    created_by: number | null;
}

export interface ProductStockData {
    productLocationStock: ProductLocationStock;
    productStockMovements: ProductStockMovement[];
}
