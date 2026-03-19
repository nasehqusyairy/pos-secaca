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

export interface CustomerCategory {
    id: number;
    name: string;
    required: boolean;
}

export interface Customer {
    id: number;
    email: string | null;
    first_name: string;
    last_name: string;
    phone_number: string;
    phone_number_country_code: string;
    customer_category: CustomerCategory;
}

export interface Promo {
    promoId: number;
    promoRewadId: number;
    amount: number;
    quantity: number;
    appliedPromoAmount: number;
    promoRewardAmount: number;
    promoName: string;
}

export interface ProductDetail {
    id: number;
    name: string;
    sku: string;
    code: string;
    barcode: string;
}

export interface Brand {
    id: number;
    name: string;
}

export interface OrderType {
    id: number;
    name: string;
}

export interface ProductUnit {
    id: number;
    name: string;
}

export interface ProductCategory {
    id: number | null;
    name: string | null;
}

export interface Product {
    customer_order_detail_id: number | null;
    product_id: number;
    brand_id: number;
    order_type_id: number;
    product_unit_id: number;
    product_category_id: number | null;
    catalogue_detail_id: number | null;
    quantity: number;
    sell_price: number;
    custom_price: boolean;
    adjustment: Adjustment;
    promo: Promo | null;
    product: ProductDetail;
    brand: Brand;
    order_type: OrderType;
    product_unit: ProductUnit;
    product_category: ProductCategory;
}

export interface SaleDataResponse {
    customerOrderId?: number;
    subTotal: number;
    taxInclusiveAmount: number;
    taxExclusiveAmount: number;
    serviceCharge: number;
    paymentPlatformFee: number;
    totalAmount: number;
    totalItem: number;
    adjustment: Adjustment;
    customer: Customer;
    promos: Promo[];
    products: Product[];
}
