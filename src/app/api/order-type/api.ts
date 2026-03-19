import apiClient from "../apiClient";
import { OrderTypes } from "./type";


export function getOrderType(limit: number, status?: string) {
    const params = {
        statuses: [status],
    }

    return apiClient(`/api/backoffice/order_types?limit=${limit}`, { params });
}

export function createOrderType(data: OrderTypes) {
    return apiClient.post(`/api/backoffice/order_types`, data)
}

export function updateOrderType(data: OrderTypes) {
    const id = data.id;

    return apiClient.put(`/api/backoffice/order_types/${id}`, data)
}