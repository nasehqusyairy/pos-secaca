import apiClient from "../../../apiClient";
import apiClientV2 from "../../../apiClientV2";
import { CustomerCategories, GetCustomerCategoryRequest } from "./type";

export function getCustomerCategories(params: GetCustomerCategoryRequest) {
    return apiClientV2.get(`/api/backoffice/customer_categories`, { params })
}

export function getOneCustomerCategory(id: number) {
    return apiClient.get(`/api/backoffice/customer_categories/${id}`)
}

export function createCustomerCategories(data: CustomerCategories) {
    return apiClient.post(`/api/backoffice/customer_categories`, data);
}

export function updateCustomerCategories(data: CustomerCategories) {
    return apiClient.put(`/api/backoffice/customer_categories/${data.id}`, data);
}

export function activateCustomerCategory(id: number) {
    return apiClient.patch(`/api/backoffice/customer_categories/${id}/activate`);
}

export function archiveCustomerCategory(id: number) {
    return apiClient.patch(`/api/backoffice/customer_categories/${id}/archive`);
}