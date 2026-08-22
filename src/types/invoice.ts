import { Employee } from "@/app/api/karyawan/type";

export interface InvoiceModel {
  id: number;
  entity_id: number;
  location_id: number;
  customer_order_id: number;
  customer_id: number;
  taking_id: number | null;
  order_type_id: number;
  device_id: number;
  checkpoint_device_id: number | null;
  code: string;
  sales_no: string;
  receipt_no: string;
  status: string;
  location_name: string;
  location_timezone: string;
  order_type_name: string;
  gross_sales: number;
  discount_amount_before_tax: number;
  surcharge_amount_before_tax: number;
  promo_amount_before_tax: number;
  free_of_charge_amount_before_tax: number;
  net_sales: number;
  service_charge_before_tax: number;
  tax_amount: number;
  rounding_amount: number;
  rounding_tax_amount: number;
  rounding_service_charge_amount: number;
  net_sales_after_tax: number;
  platform_fee: number;
  total_processing_fee: number;
  total_subsidize: number;
  receive_paid_by: number;
  payment_platform_fee: number;
  refunded_amount: number;
  paid_by: number | null;
  paid_at: string; // ISO 8601 or datetime string
  local_paid_at: string;
  void_by: number | null;
  void_at: string | null;
  local_void_at: string | null;
  void_reason: string | null;
  void_notes: string | null;
  sales_at: string;
  local_sales_at: string;
  notes: string | null;
  product_ids: number[];
  product_category_ids: (number | null)[];
  modifier_ids: string;
  modifier_option_ids: string;
  earn_point: number;
  redeem_point: number;
  created_at: string; // ISO 8601 format
  updated_at: string;
  cashier?: Employee;
  employeeSales?: Employee;
  updated_by: number | null;
  created_by: number | null;
}

interface Location {
  id: number;
  name: string;
}

interface OrderType {
  id: number;
  name: string;
}

export interface SaleTransactionDetail {
  id: number;
  sale_transaction_id: number;
  customer_order_detail_id: number;
  brand_id: number;
  location_id: number;
  order_type_id: number;
  product_id: number;
  product_category_id: number | null;
  product_unit_id: number;
  tax_id: number | null;
  brand_name: string;
  location_name: string;
  order_type_name: string;
  product_name: string;
  product_sku: string;
  product_code: string;
  product_description: string;
  product_category_name: string | null;
  product_unit_name: string;
  tax_name: string | null;
  tax_rate: number | null;
  tax_setting: string | null;
  notes: string | null;
  quantity: number;
  cancelled_quantity: number;
  sell_price: number;
  sell_price_tax_amount: number;
  promo_amount: number;
  promo_amount_tax_amount: number;
  discount_amount: number;
  discount_amount_tax_amount: number;
  surcharge_amount: number;
  surcharge_amount_tax_amount: number;
  free_of_charge_amount: number;
  free_of_charge_amount_tax_amount: number;
  service_charge: number;
  service_charge_tax_amount: number;
  service_charge_rate: number;
  service_charge_include_tax: boolean;
  prorate_promo_amount: number;
  prorate_promo_amount_tax_amount: number;
  prorate_discount_amount: number;
  prorate_discount_amount_tax_amount: number;
  prorate_surcharge_amount: number;
  prorate_surcharge_amount_tax_amount: number;
  prorate_free_of_charge_amount: number;
  prorate_free_of_charge_amount_tax_amount: number;
  modifier_subtotal: number;
  modifier_subtotal_tax_amount: number;
  modifier_service_charge: number;
  modifier_service_charge_tax_amount: number;
  modifier_prorate_promo_amount: number;
  modifier_prorate_promo_amount_tax_amount: number;
  modifier_prorate_discount_amount: number;
  modifier_prorate_discount_amount_tax_amount: number;
  modifier_prorate_surcharge_amount: number;
  modifier_prorate_surcharge_amount_tax_amount: number;
  modifier_prorate_free_of_charge_amount: number;
  modifier_prorate_free_of_charge_amount_tax_amount: number;
  modifier_total_amount: number;
  modifier_total_amount_tax_amount: number;
  total_line_amount: number;
  total_line_amount_tax_amount: number;
  total_amount: number;
  total_amount_tax_amount: number;
  modifier_ids: string;
  modifier_option_ids: string;
  loyalty_id: number | null;
  loyalty_reward_product_id: number | null;
  loyalty_point: number;
}

export interface Order {
  id: number;
  entity_id: number;
  location_id: number;
  customer_order_id: number;
  customer_id: number;
  taking_id: number | null;
  order_type_id: number;
  device_id: number;
  checkpoint_device_id: number;
  code: string;
  receipt_no: string;
  status: string;
  location_name: string;
  location_timezone: string;
  order_type_name: string;
  gross_sales: number;
  discount_amount_before_tax: number;
  surcharge_amount_before_tax: number;
  promo_amount_before_tax: number;
  free_of_charge_amount_before_tax: number;
  net_sales: number;
  service_charge_before_tax: number;
  tax_amount: number;
  rounding_amount: number;
  rounding_tax_amount: number;
  rounding_service_charge_amount: number;
  net_sales_after_tax: number;
  refunded_amount: number;
  platform_fee: number;
  total_processing_fee: number;
  total_subsidize: number;
  receive_paid_by: number;
  paid_by: number | null;
  paid_at: string;
  local_paid_at: string;
  void_by: number | null;
  void_at: string | null;
  local_void_at: string | null;
  void_reason: string | null;
  void_notes: string | null;
  sales_at: string;
  local_sales_at: string;
  notes: string | null;
  product_ids: number[];
  product_category_ids: (number | null)[];
  modifier_ids: string;
  modifier_option_ids: string;
  earn_point: number;
  redeem_point: number;
  location: Location;
  order_type: OrderType;
  sale_transaction_details: SaleTransactionDetail[];
}

export type GetInvoicesQueryParams = {
  limit: number,
  locs: number[],
  refund_amount: number,
  only_logged_cashier?: boolean,
  keyword?: string,
  cursor?: string,
  exclude_ids?: number[],
  last?: boolean;
}
