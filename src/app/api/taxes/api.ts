import apiClient from "../apiClient";
import { Taxes } from "./type";

export function getTaxes(limit = 100) {
    return apiClient.get(`/api/backoffice/taxes?limit=${limit}`);
}

export function createTaxes(data: Taxes) {
    return apiClient.post('/api/backoffice/taxes', data);
}

export function updateTaxes(data: Taxes) {
    const id = data.id

    return apiClient.put(`/api/backoffice/taxes/${id}`, data);
}