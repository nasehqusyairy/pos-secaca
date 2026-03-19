import apiClient from "../../apiClient";
import apiClientV2 from "../../apiClientV2";
import { GetPromoRequest, Promo } from "./type";

export function getPromos(params: GetPromoRequest) {
    return apiClientV2.get(`/api/backoffice/promos`, { params })
}

export function getOnePromo(id: string) {
    return apiClient.get(`/api/backoffice/promos/${id}`)
}

export function createPromo(data: Promo) {
    return apiClient.post(`/api/backoffice/promos`, data);
}