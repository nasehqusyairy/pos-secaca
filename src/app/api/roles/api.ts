import apiClient from "../apiClient";
import { GetRoleRequest, RequestRoles } from "./type";

export function getRoles(params: GetRoleRequest | null) {
    return apiClient.get(`/api/backoffice/roles`, { params });
}

export function createRole(data: RequestRoles) {
    return apiClient.post(`/api/backoffice/roles`, data);
}

export function updateRole(data: RequestRoles) {
    return apiClient.put(`/api/backoffice/roles/${data.id}`, data);
}

export function deleteRole(id: number) {
    return apiClient.delete(`/api/backoffice/roles/${id}`);
}

export function getParentRoles() {
    return apiClient.get(`/api/backoffice/parent_roles`);
}