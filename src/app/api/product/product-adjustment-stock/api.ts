import { formatDateToYYYYMMDD } from "@/lib/helpers";
import apiClient from "../../apiClient";
import apiClientV2 from "../../apiClientV2";
import { ParamsProductAdjustmentStock, ProductAdjustmentStockRequest } from "./type";
import { GetProductAdjustmentStockQueryRequest } from "../type";

export async function getProductAdjustmentStock(param: GetProductAdjustmentStockQueryRequest) {
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
        statuses: param.statuses,
        select_all_location: param.select_all_location,
        locs: param.locs,
        exclude_locs: param.exclude_locs,
        limit: param.limit,
        page: param.page,
    }

    return await apiClientV2.get("/api/backoffice/product_adjustment_stocks", { params });
}

export async function getProductAdjustmentStockDetail(id: string) {
    if (id === "0") {
        return {
            data: null,
            status: 500,
            statusText: 'Error Start Date or End Date is undefined',
            headers: {},
            config: {},
        };
    }

    return await apiClient.get(`/api/backoffice/product_adjustment_stocks/${id}`);
}

export function createProductAdjustmentStock(params: ProductAdjustmentStockRequest) {
    return apiClient.post("/api/backoffice/product_adjustment_stocks", params)
}

export function updateProductAdjustmentStock(params: ParamsProductAdjustmentStock) {
    const data = {
        products: params.products
    }

    return apiClient.put(`/api/backoffice/product_adjustment_stocks/${params.id}`, data)
}

export function deleteProductAdjustmentStock(id: number) {
    return apiClient.delete(`/api/backoffice/product_adjustment_stocks/${id}`)
}