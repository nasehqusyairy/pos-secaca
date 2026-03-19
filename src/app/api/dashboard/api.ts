import { AnnualSalesProps, SalesByDateProps } from "./type";
import apiClientV2 from "../apiClientV2";

export async function getSalesByDate(params: SalesByDateProps) {
    return apiClientV2.get(`/api/backoffice/dashboard/sales_by_dates`, { params })
}

export async function getSalesSummary(params: SalesByDateProps) {
    return apiClientV2.get(`/api/backoffice/dashboard/sales_summaries`, { params })
}

export async function getSalesRefundSummary(params: SalesByDateProps) {
    return apiClientV2.get(`/api/backoffice/dashboard/sales_refund_summaries`, { params })
}

export async function getTop5Products(params: SalesByDateProps) {
    return apiClientV2.get(`/api/backoffice/dashboard/top_5_products`, { params })
}

export async function getTop5ProductCategories(params: SalesByDateProps) {
    return apiClientV2.get(`/api/backoffice/dashboard/top_5_product_categories`, { params })
}

export async function getPotensiLabas(params: SalesByDateProps) {
    return apiClientV2.get(`/api/backoffice/dashboard/potensi_labas`, { params })
}

export async function getAnnualSales(params: AnnualSalesProps) {
    return apiClientV2.get(`/api/backoffice/dashboard/annual_sales`, { params })
}
