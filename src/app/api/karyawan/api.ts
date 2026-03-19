import apiClient from "../apiClient";
import apiClientStore from "../apiClientStore";
import { EmployeeRequest } from "./type";

// BACKOFFICE
export function getEmployee() {
    return apiClient.get(`/api/backoffice/employees`)
}

export function createEmploye(params: EmployeeRequest) {
    return apiClient.post(`/api/backoffice/employees`, params)
}

export function updateEmployee(params: EmployeeRequest) {
    return apiClient.put(`/api/backoffice/employees/${params.id}`, params)
}

export function deleteEmployee(id: number) {
    return apiClient.delete(`/api/backoffice/employees/${id}`)
}

// KASIR
export async function getCashierEmployee(limit: number, location_id: number, next_url: string | null) {
    if (next_url) {
        return await apiClientStore.get(`${next_url}`)
    }

    const response = await apiClientStore.get(`/api/kasir/employees?limit=${limit}&loc_id=${location_id}`)
    return {
        ...response,
        data: response.data.map((data: any) => ({
            ...data,
            name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
        })),
    };
}