// kasir customer

import { GetCustomerOrderQuery } from "./type";
import apiClientV2 from "../apiClientV2";
import { PaymentOrder } from "@/types/order";
import apiClientStore from "../apiClientStore";

export async function getCustomerOrder(param: GetCustomerOrderQuery) {
  return apiClientV2.get(`/api/kasir/customer_orders`, { params: param })
}

export function createOrder(data: PaymentOrder) {
  return apiClientStore.post(`/api/kasir/customer_orders`, data);
}

export function updateOrder(data: PaymentOrder) {
  return apiClientStore.put(`/api/kasir/customer_orders/${data.customerOrderId}`, data);
}