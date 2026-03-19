import apiClient from "../../apiClient";
import apiClientV2 from "../../apiClientV2";
import { GetSaleTransactionRequest, VoidSaleTransactionParams } from "./type";

export function getSaleTransaction(params: GetSaleTransactionRequest) {
    return apiClientV2.get(`/api/backoffice/sale_transactions`, { params })
}

export function getOneSaleTransaction(id: string) {
    return apiClient.get(`/api/backoffice/sale_transactions/${id}`)
}

export function getOneSaleTransactionAsPDF(id: string) {
    return apiClient.get(`/api/sale_transactions/${id}/pdf`)
}

export function voidOneSaleTransaction(params: VoidSaleTransactionParams) {
    return apiClient.patch(`/api/backoffice/sale_transactions/${params.id}/void`, params)
}