import { formatDateToYYYYMMDD } from "@/lib/helpers";
import apiClient from "../../apiClient";
import { GetTransferProductRequest } from "./type";

export async function getProductTransfers(param: GetTransferProductRequest) {
    if (!param.startDate || !param.endDate) {
        return {
            data: [],
            status: 500,
            statusText: 'Error Start Date or End Date is undefined',
            headers: {},
            config: {},
        };
    }

    const params = {
        start_date: formatDateToYYYYMMDD(param.startDate),
        end_date: formatDateToYYYYMMDD(param.endDate),
        from_locs: param.fromLocs,
        from_select_all_location: param.fromSelectAllLocation,
        from_exclude_locs: param.fromExcludeLocs,
        to_locs: param.toLocs,
        to_select_all_location: param.toSelectAllLocation,
        to_exclude_locs: param.toExcludeLocs,
    }

    return await apiClient.get("/api/backoffice/product_transfer_services", { params });
}

export function getProductTransfer(id: string) {
    return apiClient.get(`/api/backoffice/product_transfer_services/${id}`);
}

export function createProductTransfer(data: any) {
    return apiClient.post("/api/backoffice/product_transfer_services", data);
}

export function approveProductTransfer(id: number, notes: string) {
    const data = {
        notes
    }

    return apiClient.post(`/api/backoffice/product_transfer_services/${id}/approve`, data);
}

export function rejectProductTransfer(id: number, notes: string) {
    const data = {
        notes
    }

    return apiClient.post(`/api/backoffice/product_transfer_services/${id}/reject`, data);
}

export function updateProductTransfer(data: any) {
    return apiClient.put(`/api/backoffice/product_transfer_services/${data.id}`, data);
}