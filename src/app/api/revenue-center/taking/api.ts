import apiClient from "../../apiClient";
import apiClientV2 from "../../apiClientV2";
import { GetDailySaleRequest } from "./type";

export function getDailySales(params: GetDailySaleRequest) {
    return apiClientV2.get(`/api/backoffice/daily_sales`, { params })
}

export function getOneDailySale(id: string) {
    return apiClient.get(`/api/backoffice/daily_sales/${id}`)
}