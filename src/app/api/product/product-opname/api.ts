import { formatDateToYYYYMMDD } from "@/lib/helpers";
import apiClient from "../../apiClient";
import apiClientV2 from "../../apiClientV2";
import { GetProductOpnamePreviewRequest, GetProductStockOpnameQueryRequest, ParamsProductOpname, ProductOpnameRequest } from "./type";

export async function getProductOpname(param: GetProductStockOpnameQueryRequest) {
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

    return await apiClientV2.get("/api/backoffice/product_opname_services", { params });
}

export async function getProductOpnameDetail(id: string) {
    if (id === "0") {
        return {
            data: null,
            status: 500,
            statusText: 'Error Start Date or End Date is undefined',
            headers: {},
            config: {},
        };
    }

    return await apiClient.get(`/api/backoffice/product_opname_services/${id}`);
}

export async function getProductOpnamePreview(param: GetProductOpnamePreviewRequest) {
    if (param.id.toString() === "0") {
        return {
            data: null,
            status: 500,
            statusText: 'Error Start Date or End Date is undefined',
            headers: {},
            config: {},
        };
    }

    const params = {
        ...param,
        show_all: param.show_all.toString(),
        show_difference: param.show_difference.toString(),
    }

    return await apiClientV2.get(`/api/backoffice/product_opname_services/${param.id}/preview`, { params });
}

export function createProductOpname(params: ProductOpnameRequest) {
    return apiClient.post("/api/backoffice/product_opname_services", params)
}

export function newUpdateProductOpname(params: ProductOpnameRequest) {
    return apiClient.put(`/api/backoffice/product_opname_services/${params.id}`, params)
}

export function updateProductOpname(params: ParamsProductOpname) {
    const data = {
        products: params.products
    }

    return apiClient.put(`/api/backoffice/product_opname_services/${params.id}`, data)
}

export function deleteProductOpname(id: number) {
    return apiClient.delete(`/api/backoffice/product_opname_services/${id}`)
}