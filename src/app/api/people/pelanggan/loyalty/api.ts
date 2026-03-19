import apiClient from "../../../apiClient";
import apiClientV2 from "../../../apiClientV2";
import { GetLoyaltyRequest, Loyalties } from "./type";

export function getLoyalties(params: GetLoyaltyRequest) {
    return apiClientV2.get(`/api/backoffice/loyalties`, { params })
}

export function getOneLoyalty(id: string) {
    return apiClient.get(`/api/backoffice/loyalties/${id}`)
}

export function createLoyalty(data: Loyalties) {
    return apiClient.post(`/api/backoffice/loyalties`, data);
}

export function updateLoyalty(id: string, data: Loyalties) {
    return apiClient.put(`/api/backoffice/loyalties/${id}`, data);
}