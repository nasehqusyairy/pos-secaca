import { useQuery } from "@tanstack/react-query";
import { AnnualSalesProps, SalesByDateProps } from "./type";
import { getAnnualSales, getPotensiLabas, getSalesByDate, getSalesRefundSummary, getSalesSummary, getTop5ProductCategories, getTop5Products } from "./api";

export function useGetSalesByDate(params: SalesByDateProps,) {
    return useQuery({
        queryKey: ["dashboard", 'sales-by-date'],
        queryFn: () => getSalesByDate(params),
    })
}

export function useGetSalesSummary(params: SalesByDateProps,) {
    return useQuery({
        queryKey: ["dashboard", 'sales-summary'],
        queryFn: () => getSalesSummary(params),
    })
}

export function useGetSalesRefundSummary(params: SalesByDateProps,) {
    return useQuery({
        queryKey: ["dashboard", 'sales-refund-summary'],
        queryFn: () => getSalesRefundSummary(params),
    })
}

export function useGetTop5Products(params: SalesByDateProps,) {
    return useQuery({
        queryKey: ["dashboard", 'get-top5-products'],
        queryFn: () => getTop5Products(params),
    })
}

export function useGetTop5ProductCategories(params: SalesByDateProps,) {
    return useQuery({
        queryKey: ["dashboard", 'get-top5-product-categories'],
        queryFn: () => getTop5ProductCategories(params),
    })
}

export function useGetPotensiLabas(params: SalesByDateProps,) {
    return useQuery({
        queryKey: ["dashboard", 'get-potensi-laba'],
        queryFn: () => getPotensiLabas(params),
    })
}

export function useGetAnnualSales(params: AnnualSalesProps,) {
    return useQuery({
        queryKey: ["dashboard", 'annual-sales'],
        queryFn: () => getAnnualSales(params),
    })
}
