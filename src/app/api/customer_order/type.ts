import { Customer } from "@/types/order"
import { Adjustment, OrderType, ProductCategory, Promo } from "@/types/response/calculate_promo"
import { ProductUnit } from "../product/kasir-product/type";
import { ProductLocationStocks, ProductSellPrices } from "../catalogues/type";

export interface ProductDetail {
    id: number;
    name: string;
    sku: string;
    code: string;
    barcode: string;
    product_location_stocks?: ProductLocationStocks[];
    product_sell_prices?: ProductSellPrices[];
}

export type CustomerOrderDetail = {
    id: number,
    brand_id: number,
    customer_order_id: number,
    adjustment: Adjustment,
    free_of_charge_amount: number,
    product_category_id: number,
    product_category_name: string,
    product_id: number,
    product_name: string,
    product_unit_id: number,
    product_unit_name: string,
    order_type_id: number,
    quantity: number,
    sell_price: string,
    total_amount: number,
    total_line_amount: number,
    custom_price: boolean,
    product: ProductDetail,
    order_type: OrderType;
    product_unit: ProductUnit;
    product_category: ProductCategory;
    promo: Promo;
    product_location_stocks: ProductLocationStocks[];
    product_sell_prices: ProductSellPrices[];
}

export type CustomerOrder = {
    id?: number,
    code?: string,
    location_id: number,
    subtotal: number,
    total_amount: string,
    tax_exclusive_amount: number,
    tax_inclusive_amount: number,
    payment_platform_fee: number,
    service_charge: number,
    customer?: Customer,
    adjustment: Adjustment | null,
    customer_order_details: CustomerOrderDetail[],
}

export type GetCustomerOrderQuery = {
    cursor?: string,
    limit: number,
    locs: number[],
}