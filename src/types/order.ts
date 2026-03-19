type Products = {
  customer_order_detail_id?: number | null;
  product_id?: number;
  brand_id?: number | null;
  order_type_id?: number;
  product_unit_id?: number;
  product_category_id?: number;
  catalogue_detail_id?: number | null;
  quantity?: number | null;
  stock?: number | null;
  sell_price?: number | null;
  custom_price?: boolean;
};

type Order = {
  id?: number;
  location_id?: number;
  order_type_id?: number;
  products?: Products[];
  employee_sales_id?: number;
};

type Adjustment = {
  quantity: number,
  amount: number,
  free_of_charge: boolean,
  is_percentage: boolean
}

// order
type OrderPromo = {
  location_id?: number;
  order_type_id?: number;
  customer?: Customer;
  products?: Product[];
  adjustment?: Adjustment
};


// pembayaran
type PaymentOrder = {
  id: number | null;
  customerOrderId?: number;
  customer_order_id?: number;
  location_id: number;
  order_type_id: number;
  customer: Customer;
  products: Product[];
  payments: Payment[];
};

type Customer = {
  id?: number | null;
  location_id?: number | null;

  email: string | null;
  first_name: string;
  last_name: string;
  phone_number: string;
  phone_number_country_code: string;
};

type Kasir = {
  id: number,
  first_name: string,
  last_name: string
}

type Product = {
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

type Payment = {
  payment_method_id: number;
  amount_receive: number;
  change: number;
};

export type { Products, Order, PaymentOrder, Customer, Product, Payment, OrderPromo, Kasir };
