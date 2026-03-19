import apiClient from "../../apiClient";
import { ProductCategories } from "./type";

export function getProductCategory(limit: number) {
    return apiClient.get(`/api/backoffice/product_categories?limit=${limit}`)
}

export function createProductCategory(data: ProductCategories) {
    return apiClient.post(`/api/backoffice/product_categories`, data)
}

export function updateProductCategory(data: ProductCategories) {
    const id = data.id;

    return apiClient.put(`/api/backoffice/product_categories/${id}`, data)
}