export interface SaleSummary {
    grossSales: number;
    discountBeforeTax: number;
    promoBeforeTax: number;
    surchargeBeforeTax: number;
    netSales: number;
    serviceCharge: number;
    taxAmount: number;
    netSalesAfterTax: number;
}

export interface PaymentSummary {
    id: number;
    name: string;
    recorded_amount: number;
    counted_amount: number;
    difference_amount: number;
    sales_amount: number;
    sales_count: number;
    refund_amount: number;
    refund_count: number;
    money_movement_in_amount: number;
    money_movement_in_count: number;
    money_movement_out_amount: number;
    money_movement_out_count: number;
    customer_deposit_amount: number;
    customer_deposit_count: number;
    product_sold_count: number;
    product_category_sold_count: number;
    product_return_count: number;
    product_category_return_count: number;
    payment_method_id: number;
}

export interface SaleData {
    saleTransactionIds: number[];
    saleSummaries: SaleSummary;
    paymentSummaries: PaymentSummary[];
    saleRefundIds: number[];
    saleRefundSummaries: SaleSummary;
}

export interface PaymentSummaryRequest {
    payment_method_id: number;
    recorded_amount: number;
    counted_amount: number;
    difference_amount: number;
    sales_amount: number;
    sales_count: number;
    refund_amount: number;
    refund_count: number;
    money_movement_in_amount: number;
    money_movement_in_count: number;
    money_movement_out_amount: number;
    money_movement_out_count: number;
    customer_deposit_amount: number;
    customer_deposit_count: number;
    product_sold_count: number;
    product_category_sold_count: number;
    product_return_count: number;
    product_category_return_count: number;
}

export interface SaleDataRequest {
    locationId: number;
    isShift: boolean;
    saleReferenceId: number;
    saleRefundIds: number[];
    saleTransactionIds: number[];
    moneyMovementIds: number[] | null;
    customerDepositIds: number[] | null;
    paymentSummaries: PaymentSummary[];
}
