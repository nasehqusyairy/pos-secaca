import { Catalogues } from "@/app/api/catalogues/type";
import { Customer, Order } from "@/types/order";

export interface SelectedProductsState {
    products: Catalogues[];
    setSelectedProductsState: (products: Catalogues[]) => void;
}

export interface OrderState {
    order?: Order;
    orderTypeId?: number;
    amount: number;
    customer?: Customer;
    employee_sales_id: number;
    setOrder: (
        order: Order,
        orderTypeId: number,
        amount: number,
        customer: Customer,
        employee_sales_id: number
    ) => void;
}