import { PaymentOrder } from "@/types/order";
import apiClientStore from "../apiClientStore";
import apiClientStoreV2 from "../apiClientStoreV2";

export function getCatalogueByName(keyword: string, locId: number) {
  const params = {
    limit: 16,
    location: locId,
    keyword: keyword,
  }

  return apiClientStore.get('api/kasir/catalogues/product_search', { params });
}

export function getCatalogueByNameWithCursor(keyword: string, location: number, cursor: string | null, filter_stock: boolean, limit: number = 16) {
  const params = {
    limit,
    cursor,
    filter_stock,
    location,
    keyword,
  }

  return apiClientStoreV2.get('api/kasir/catalogues/product_search', { params });
}

export function createSales(data: PaymentOrder) {
  return apiClientStore.post(`/api/kasir/sale_transactions`, data);
}

export function createOrderLocal(data: PaymentOrder) {
  return apiClientStore.post(`/api/kasir/customer_orders`, data);
}

export function updateOrder(data: PaymentOrder) {
  const id = data.id;

  return apiClientStore.put(`/api/kasir/customer_orders/:id/${id}`, data);
}

export function checkPromo(data: any) {
  return apiClientStore.post(`/api/kasir/customer_orders/calculate_promo`, data)
}