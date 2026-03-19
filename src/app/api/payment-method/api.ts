import apiClient from "../apiClient";
import { PaymentMethods } from "./type";

export function getPaymentMethod(limit: number, statuses?: string[]) {
    const params = {
        statuses: statuses,
    }

    return apiClient.get(`/api/backoffice/payment_methods?limit=${limit}`, { params })
}

export function createPaymentMethod(data: PaymentMethods) {
    return apiClient.post(`/api/backoffice/payment_methods`, data)
}

export function updatePaymentMethod(data: PaymentMethods) {
    const id = data.id;

    return apiClient.put(`/api/backoffice/payment_methods/${id}`, data)
}