import { ProductCategories, ProductLocationStocks } from "../catalogues/type";
import { ProductUnits } from "./product-unit/type";

export type Product = {
    id: number | null;
    entity_id: string;
    product_category_id: string;
    product_unit_id: string;
    location_id: string;
    tax_id: string | null;
    product_sell_unit_id: string;
    parent_variance_id: string | null;
    name: string;
    code: string;
    sku: string;
    barcode: string;
    description: string;
    image_url: string | null;
    sell_to_customer: boolean;
    service: boolean;
    modifier: boolean;
    has_variance: boolean;
    allow_custom_price: boolean;
    select_all_location: boolean;
    location_ids: string[] | null;
    exclude_location_ids: string[] | null;
    tax_setting: string | null;
    sell_price: string;
    last_buying_price: string;
    cost_of_goods_sold: string;
    cost_of_gold_sold: string;
    stock: string;
    status: string;

    product_location_stocks: ProductLocationStocks[] | null;
    product_location_stock: SimpleProductLocationStock;
    product_category: ProductCategories;
    product_unit: ProductUnits;
    product_sell_unit: ProductUnits;
};

type SimpleProductLocationStock = {
    stock: number;
    average_buy_price: number;
}

export type GetProductStockRequest = {
    product: number;
    product_unit: number;
    location: number;
};

export type GetProductAdjustmentStockQueryRequest = {
    startDate: Date | undefined;
    endDate: Date | undefined;
    statuses: string[];
    select_all_location: boolean;
    locs: number[];
    exclude_locs: number[];
    limit: number;
    page: number;
};

export type GetProductRequest = {
    limit: number;
    page: number;
    keyword: string;
    selectAllProductCategory: boolean;
    productCategoryIds: number[];
    excludeProductCategoryIds: number[];
};

// request
type ProductRequest = {
    id: number | null,
    product_id: number;
    product_unit_id: number;
    product_category_id: number | null;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
    note: string | null;
};

export interface ProductOpnameDetail {
    id: number | null,
    product_id: number;
    product_unit_id: number;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
}

export type ProductOpnameRequest = {
    id: number | null;
    location_id: number;
    auto_approve: boolean;
    note: string | null;
    recorded_product_count: number;
    counted_product_count: number;
    difference_product_count: number;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
    products: ProductRequest[];
}

// Detail
export interface ProductsDetail {
    id: number,
    _deleted: boolean,
    product_id: number,
    product_unit_id: number,
    product_category_id: number | null,
    recorder_stock: number,
    counted_stock: number,
    difference_stock: number,
    note: string | null
}

export interface ParamsProductOpname {
    id: number,
    products: ProductsDetail[]
}

export interface ParamsProductStockMovement {
    location_id: number,
    current_stock: number,
    stock: number,
    buying_price: number,
}

// ProductAdjustmentStock
export interface ProductAdjustmentStockDetail {
    id: number | null,
    product_id: number;
    product_unit_id: number;
    product_category_id: number;
    recorded_stock: number;
    counted_stock: number;
    note: string | null,
    difference_stock: number;
}

export type ProductAdjustmentStockRequest = {
    id: number | null;
    location_id: number;
    auto_approve: boolean;
    note: string | null;
    recorded_product_count: number;
    counted_product_count: number;
    difference_product_count: number;
    recorded_stock: number;
    counted_stock: number;
    difference_stock: number;
    products: ProductRequest[];
}

export interface ParamsProductAdjustmentStock {
    id: number,
    products: ProductsDetail[]
}