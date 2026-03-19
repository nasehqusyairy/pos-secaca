import apiClient from "../../apiClient";
import { ProductUnits } from "./type";

export function getProductUnit(limit: number) {
    return apiClient.get(`/api/backoffice/product_units?limit=${limit}`)
}

export function createProductUnit(data: ProductUnits) {
    return apiClient.post(`/api/backoffice/product_units`, data)
}

export function updateProductUnit(data: ProductUnits) {
    const id = data.id;

    return apiClient.put(`/api/backoffice/product_units/${id}`, data)
}